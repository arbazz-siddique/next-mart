
import { NextResponse } from "next/server"
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/middlewares/authSeller";
import prisma from "@/lib/prisma";

// get dashabord data for admin (total orders, total stores, total products, total revenue)

export async function GET(request) {
    try {
        const {userId} = getAuth(request)
        const isAdmin = await authAdmin(userId)
         if(!isAdmin){
             return NextResponse.json({error:"Not authorized"}, {status:401})
        }

        // get total orders
        const orders = await prisma.order.count();
        // get total stores on app
        const stores = await prisma.store.count();
        // get all orders include only createdAt and total & calculate total revenue
        const allOrders = await prisma.order.findMany({
            select:{
                createdAt:true,
                total:true
            }
        })
        let totalRevenue =0;
        allOrders.forEach(order => {
            totalRevenue += order.total
        })

        const revenue = totalRevenue.toFixed(2)

        // total products on app

        const products = await prisma.product.count()

        const dashabordData = {
            orders,
            stores,
            products,
            revenue,
            allOrders
        }
        return NextResponse.json({dashabordData})

    } catch (error) {
        console.log(error)
        return NextResponse.json({error: error.code || error.message}, {status:400})
    }
}