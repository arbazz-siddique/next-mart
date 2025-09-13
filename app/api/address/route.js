import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// add new address


export async function POST(request) {
    try {
        const {userId} = getAuth(request)
        const {address} = await request.json()
        address.userId = userId
        // save to cart to the user objec
        const newAddress = await prisma.address.create({
            data:address
        })
        return NextResponse.json({newAddress, message:"address added successfully"})
    } catch (error) {
         console.log(error)
        return NextResponse.json({error: error.code || error.message}, {status:401})
    }
}

// get all address for a user 
export async function GET(request) {
    try {
        const {userId} = getAuth(request)
       
        const addresses = await prisma.address.findMany({
            where:{userId}
        })
        return NextResponse.json({addresses})
    } catch (error) {
         console.log(error)
        return NextResponse.json({error: error.code || error.message}, {status:401})
    }
}
