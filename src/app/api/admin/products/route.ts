import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import jwt from "jsonwebtoken";
import { headers, cookies } from "next/headers";
import cloudinary from "@/lib/cloudinary"; // Added
import { Readable } from "stream"; // Added

export const dynamic = 'force-dynamic';

interface DecodedToken {
  id: string;
  role: string;
  [key: string]: any;
}

// ... (GET function remains the same)

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

    // -------------------------------------
    // 2️⃣ LEER FORM DATA DEL REQUEST
    // -------------------------------------
    const form = await req.formData();

    const name = form.get("name")?.toString() || "";
    const description = form.get("description")?.toString() || "";
    const price = parseFloat(form.get("price")?.toString() || "");
    const stock = parseInt(form.get("stock")?.toString() || "");
    const file = form.get("image") as File | null;

    if (!name || isNaN(price) || isNaN(stock)) {
      return NextResponse.json({ message: "Faltan campos obligatorios (name, price, stock) o son inválidos." }, { status: 400 });
    }

    let imageUrl: string | undefined;

    if (file && file.size > 0) {
        // ---------------------------------
        // 3️⃣ SUBIR IMAGEN A CLOUDINARY
        // ---------------------------------
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result: any = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "triton_products", // Specific folder for products
              public_id: `${Date.now()}_${file.name}`,
              resource_type: "image",
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          Readable.from(buffer).pipe(uploadStream);
        });
        imageUrl = result.secure_url;
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
      image: imageUrl, // Use the uploaded image URL
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

