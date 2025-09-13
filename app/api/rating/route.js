
// add new ratting

import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const {userId} = getAuth(request);
        const {orderId, productId, rating, review} = await request.json();
        const order = await prisma.order.findUnique({
            where:{id: orderId, userId}
        })
        if(!order){
            return NextResponse.json({error:"Order Not found!"}, {status:405})
        }
        const isAlreadyRated = await prisma.rating.findFirst({where:{productId, orderId}})
        if(isAlreadyRated){
            return NextResponse.json({error:"Proudct already reted!"}, {status:400})
        }
        const response = await prisma.rating.create({
            data:{
                userId,
                productId,
                rating,
                review,
                orderId,
            }
        })
        return NextResponse.json({message:"Rating added successfully", rating: response} )
    } catch (error) {
         console.log(error)
        return NextResponse.json({error: error.code || error.message}, {status:405})
    }
}

// get all ratings for a user 

export async function GET(request) {

    try {
        const {userId} = getAuth(request)
        if(!userId){
            return NextResponse.json({error:"Unauthorized"}, {status:401})
        }
        const ratings = await prisma.rating.findMany({
            where:{userId}
        })
        return NextResponse.json({ratings})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: error.code || error.message}, {status:405})
    }

}