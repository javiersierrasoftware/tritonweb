import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import jwt from "jsonwebtoken";
import { headers, cookies } from "next/headers"; // Added cookies

export const dynamic = 'force-dynamic';

interface DecodedToken {
  id: string;
  role: string;
  [key: string]: any;
}

export async function GET(req: Request) {
  try {
    // Try to get token from cookie first
    const cookieStore = cookies();
    let token = cookieStore.get("triton_session_token")?.value;

    // Fallback to Authorization header if not found in cookie
    if (!token) {
      token = headers().get("authorization")?.split(" ")[1];
    }
    
    if (!token) return NextResponse.json({ message: "No autenticado" }, { status: 401 });

    const secret = process.env.JWT_SECRET!;
    const user = jwt.verify(token, secret) as DecodedToken;

    if (user.role !== "ADMIN") {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    }

    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 });

    return NextResponse.json(products);
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ message: "Error interno del servidor", error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Try to get token from cookie first
    const cookieStore = cookies();
    let token = cookieStore.get("triton_session_token")?.value;

    // Fallback to Authorization header if not found in cookie
    if (!token) {
      token = headers().get("authorization")?.split(" ")[1];
    }

    if (!token) return NextResponse.json({ message: "No autenticado" }, { status: 401 });

    const secret = process.env.JWT_SECRET!;
    const user = jwt.verify(token, secret) as DecodedToken;

    if (user.role !== "ADMIN") {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    }

    await connectDB();

    const body = await req.json();
    const { name, description, price, image, stock } = body;

    if (!name || !price || !stock) {
      return NextResponse.json({ message: "Faltan campos obligatorios (name, price, stock)." }, { status: 400 });
    }

    // Generate slug
    const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return NextResponse.json({ message: "Ya existe un producto con este nombre (slug)." }, { status: 409 });
    }

    const newProduct = new Product({
      name,
      slug,
      description,
      price,
      image,
      stock,
      createdBy: user.id,
    });

    await newProduct.save();

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json({ message: "Error interno del servidor", error: error.message }, { status: 500 });
  }
}
