import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { isValidObjectId } from "mongoose";

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: "ID de orden inválido." }, { status: 400 });
    }

    const order = await Order.findById(id)
      .populate('items.productId') // Populate product details if needed
      .lean(); // Convert to plain JavaScript object

    if (!order) {
      return NextResponse.json({ message: "Orden no encontrada." }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ message: "Error interno del servidor", error: error.message }, { status: 500 });
  }
}