// /api/products/best-selling/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    let products = await prisma.product.findMany({
      where: { inStock: true },
      include: {
        rating: true,
        store: true,
      },
    });

    // Keep only products with reviews
    products = products.filter(p => p.rating.length > 0);

    // Sort by average rating
    products.sort((a, b) => {
      const avgA = a.rating.reduce((sum, r) => sum + r.rating, 0) / a.rating.length;
      const avgB = b.rating.reduce((sum, r) => sum + r.rating, 0) / b.rating.length;
      return avgB - avgA;
    });

    // Return only top 8
    return NextResponse.json({ bestSelling: products.slice(0, 8) });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 405 }
    );
  }
}
