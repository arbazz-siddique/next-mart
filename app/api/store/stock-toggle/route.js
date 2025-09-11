import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authSeller from "@/middlewares/authSeller";
import prisma from "@/lib/prisma";
// toggle stock of a product 
export async function POST(request) {
    try {
        const {userId} = getAuth(request);
        const {productId} = await request.json()
        if(!productId){
            return NextResponse.json({error:"Missing details: ProudctId"}, {status:400})
        }
        const storeId = await authSeller(userId)
         if(!storeId){
            return NextResponse.json({error:"Not authorized"}, {status:401})
         }

         // check is product exists
         const product = await prisma.product.findFirst({
            where:{id: productId , storeId}
         })

         if(!product){
            return NextResponse.json({message:"Product was not found"}, {status:404})
         }

         await prisma.product.update({
            where: {id:productId},
            data: {inStock: !product.inStock}
         })
         return NextResponse.json({message:"Proudct stock updated successfully"})

    } catch (error) {
          console.log(error)
                return NextResponse.json({error: error.code || error.message}, {status:400})
    }
}