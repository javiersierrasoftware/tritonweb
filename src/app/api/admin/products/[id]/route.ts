import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import jwt from "jsonwebtoken";
import { headers, cookies } from "next/headers"; // Added cookies
import { isValidObjectId } from "mongoose";

export const dynamic = 'force-dynamic';

interface DecodedToken {
  id: string;
  role: string;
  [key: string]: any;
}

// Helper function to extract token
function getToken(req: Request) {
    const cookieStore = cookies();
    let token = cookieStore.get("triton_session_token")?.value;

    if (!token) {
      token = headers().get("authorization")?.split(" ")[1];
    }
    return token;
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = getToken(req);
    if (!token) return NextResponse.json({ message: "No autenticado" }, { status: 401 });

    const secret = process.env.JWT_SECRET!;
    const user = jwt.verify(token, secret) as DecodedToken;

    if (user.role !== "ADMIN") {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    }

    await connectDB();

    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ message: "ID de producto inválido." }, { status: 400 });
    }

    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json({ message: "Producto no encontrado." }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ message: "Error interno del servidor", error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = getToken(req);
    if (!token) return NextResponse.json({ message: "No autenticado" }, { status: 401 });

    const secret = process.env.JWT_SECRET!;
    const user = jwt.verify(token, secret) as DecodedToken;

    if (user.role !== "ADMIN") {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    }

    await connectDB();

    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ message: "ID de producto inválido." }, { status: 400 });
    }

    const body = await req.json();
    const { name, description, price, image, stock } = body;

    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      { name, description, price, image, stock },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ message: "Producto no encontrado." }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json({ message: "Error interno del servidor", error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = getToken(req);
    if (!token) return NextResponse.json({ message: "No autenticado" }, { status: 401 });

    const secret = process.env.JWT_SECRET!;
    const user = jwt.verify(token, secret) as DecodedToken;

    if (user.role !== "ADMIN") {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    }

    await connectDB();

    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ message: "ID de producto inválido." }, { status: 400 });
    }

    const deletedProduct = await Product.findByIdAndDelete(params.id);

    if (!deletedProduct) {
      return NextResponse.json({ message: "Producto no encontrado." }, { status: 404 });
    }

    return NextResponse.json({ message: "Producto eliminado correctamente." });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ message: "Error interno del servidor", error: error.message }, { status: 500 });
  }
}
