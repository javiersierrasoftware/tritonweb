import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import jwt from "jsonwebtoken";
import { headers, cookies } from "next/headers";
import { isValidObjectId } from "mongoose";
import cloudinary from "@/lib/cloudinary"; // Added
import { Readable } from "stream"; // Added

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

    // -------------------------------------
    // 2️⃣ LEER FORM DATA DEL REQUEST
    // -------------------------------------
    const form = await req.formData();

    const name = form.get("name")?.toString() || "";
    const description = form.get("description")?.toString();
    const price = parseFloat(form.get("price")?.toString() || "");
    const stock = parseInt(form.get("stock")?.toString() || "");
    const file = form.get("image") as File | string | null; // Can be File, or string (existing URL), or null

    if (!name || isNaN(price) || isNaN(stock)) {
        return NextResponse.json({ message: "Faltan campos obligatorios (name, price, stock) o son inválidos." }, { status: 400 });
    }

    let imageUrl: string | undefined | null = description === '' ? undefined : description; // If description is empty, set to undefined to remove from DB.

    if (file && typeof file !== 'string' && file.size > 0) { // If a new file is uploaded
        // ---------------------------------
        // 3️⃣ SUBIR IMAGEN A CLOUDINARY
        // ---------------------------------
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result: any = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "triton_products",
              public_id: `${Date.now()}_${(file as File).name}`, // Cast to File if it's a File
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
    } else if (typeof file === 'string' && file) { // If 'image' is a string (existing URL)
        imageUrl = file;
    } else if (file === null || (typeof file !== 'string' && file && file.size === 0)) { // If image is explicitly removed or empty file
        imageUrl = null; // Set to null to remove it from the product
    }
    // If image is undefined (not sent), it won't be updated.

    // Generate slug - For PATCH, we might not update slug automatically, or handle it specially.
    // For now, let's keep it simple and just update if name changes, or use existing if not.
    // Assuming slug is derived from name and might need to be unique.
    // For simplicity, we'll generate a new slug if the name changes
    // If name is not provided, we won't try to generate a new slug.
    let updatedSlug = undefined;
    if (name) {
        updatedSlug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
        const existingProductWithSameSlug = await Product.findOne({ slug: updatedSlug, _id: { $ne: params.id } });
        if (existingProductWithSameSlug) {
             return NextResponse.json({ message: "Ya existe otro producto con este nombre (slug)." }, { status: 409 });
        }
    }


    const updateData: Record<string, any> = {
      name,
      description,
      price,
      stock,
    };

    if (imageUrl !== undefined) { // Only update image if it was explicitly sent or removed
      updateData.image = imageUrl;
    }

    if (updatedSlug) {
        updateData.slug = updatedSlug;
    }


    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      updateData,
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
