import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
    try {
        const body = await request.text();
        const sig = request.headers.get('stripe-signature')

        const event = stripe.webhooks.constructEvent(body,sig, process.env.STRIPE_WEBHOOK_SECRET)

        const handlePaymentIntent = async (paymentIntentId, isPaid)=>{
            const session = await stripe.checkout.sessions.list({
                payment_intent: paymentIntentId
            })
            const {orderIds, userId, appId} = session.data[0].metadata
            if(appId !== 'gocart'){
                return NextResponse.json({received:true, message:"Invalid app id"})
        }

            const orderIdArray = orderIds.split(',')
            if(isPaid){
                // mark order as paid
                await Promise.all(orderIdArray.map(async(orderId)=>{
                    await prisma.order.update({
                        where:{id:orderId},
                        data:{isPaid: true}
                    })
                }))
                //delete cart from user
                await prisma.user.update({
                    where:{id:userId},
                    data:{cart: {}}
                })
            }else{
                // delete order form database
                await Promise.all(orderIdArray.map(async(orderId)=>{
                    await prisma.order.delete({
                        where:{id: orderId}
                    })
                }))
            }
        }

       

        switch (event.type) {
            case 'payment_intent.succeeded':{
                await handlePaymentIntent(event.data.object.id, true)
                break;
            }
            case 'payment_intent.canceled':{
                await handlePaymentIntent(event.data.object.id, false)
                break;
            }
        
            default:
                console.log('unhandled event type: ', event.type)
                break;
        }
        return NextResponse.json({received:true})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: error.message}, {status:405})
    }
}


export const config = {
    api: {bodyparser: false}
}