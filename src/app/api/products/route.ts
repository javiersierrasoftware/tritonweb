import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 });

    return NextResponse.json(products);
  } catch (error: any) {
    console.error("Error fetching public products:", error);
    return NextResponse.json({ message: "Error interno del servidor", error: error.message }, { status: 500 });
  }
}
