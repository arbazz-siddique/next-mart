import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { PaymentMethod } from "@prisma/client";
import { NextResponse } from "next/server";
import toast from "react-hot-toast";

export async function POST(request) {
    try {
        const {userId, has} = getAuth(request);
        if(!userId){
            return NextResponse.json({error:"Not Authorized"}, {status:401})
        }
        const {addressId, items, couponCode, paymentMethod} = await request.json()
        // check if all required fields are present

        if(!addressId || !paymentMethod || !items || !Array.isArray(items) || !items.length ===0){
            return NextResponse.json({error:"Missing order details."}, {status:400})
        }
        let coupon = null;

        if(couponCode){
            coupon = await prisma.coupon.findUnique({
            where:{code: couponCode }
            })
         if(!coupon){
            return NextResponse.json({error:"coupon not found!"}, {status:404})
        }

        }

         // check if coupon is applicable for new users
       
        if(couponCode && coupon.forNewUser){
            const userorders = await prisma.order.findMany({
                where: {userId}
            })
            if(userorders.length > 0){
                return NextResponse.json({error:"Coupon valid for new user"}, {status:400})
            }
        }
        // check if coupon is applicable for  members
        const isPlusMember = has({plan: 'plus'});

        if(couponCode && coupon.forMember){
             if(isPlusMember){
                return NextResponse.json({error:"Coupon valid for Member only."}, {status:400})
            }
        }
        // group orders by storeid uisng map

        const orderByStore = new Map();
        for(const item of items){
            const product = await prisma.product.findUnique({where:{id: item.id}})
            const storeId = product.storeId;
            if(!orderByStore.has(storeId)){
                orderByStore.set(storeId, [])
            }
            orderByStore.get(storeId).push({...item, price: product.price})
        }

        let orderIds = [];
        let fullAmount =0;

        let isShippingFeeAdded = false;
        //Create orders for each seller

        for(const [storeId, sellerItems] of orderByStore.entries()){
            let total = sellerItems.reduce((acc, item)=> acc + (item.price * item.quantity), 0)
            if(couponCode){
                total -= (total * coupon.discount) /100;

            }
            if(!isPlusMember && !isShippingFeeAdded ){
                total += 4;
                isShippingFeeAdded =true
            }
            fullAmount += parseFloat(total.toFixed(2))
            const order = await prisma.order.create({
                data:{
                    userId,
                    storeId,
                    addressId,
                    total : parseFloat(total.toFixed(2)),
                    paymentMethod,
                    isCouponUsed:coupon ? true : false,
                    coupon: coupon ? coupon : {},
                    orderItems:{
                        create:sellerItems.map(item => ({
                            productId : item.id,
                            quantity: item.quantity,
                            price: item.price,

                        }))
                    }
                }
            })
            orderIds.push(order.id)
        }
        // clear the cart

        await prisma.user.update({
            where: {id: userId},
            data:{
                cart: {}
            }
        })

        return NextResponse.json({message: "Order Placed Successfully"})

    } catch (error) {
        console.log(error)
        return NextResponse.json({error: error.code || error.message}, {status:405})
    }
}

// get all orders for a user

export async function GET(request) {
    try {
        const {userId} = getAuth(request);
        const orders = await prisma.order.findMany({
            where:{userId, OR : [
                {paymentMethod:PaymentMethod.COD},
                {AND: [{paymentMethod: PaymentMethod.STRIPE}, {isPaid:true}]},
            ]},
            include:{
                orderItems: {include:{product: true}},
                address: true,

            },
            orderBy:{createdAt:'desc'}
        })
        return NextResponse.json({orders})
        
    } catch (error) {
         console.log(error)
        return NextResponse.json({error: error.message}, {status:405})
    }
}