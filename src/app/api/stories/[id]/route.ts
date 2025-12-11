import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Story from "@/models/Story";
import cloudinary from "@/lib/cloudinary";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { isValidObjectId } from "mongoose";
import { Readable } from "stream";

interface DecodedToken {
  id: string;
  role: string;
  [key: string]: any;
}

// GET: Obtener los datos de una historia para el formulario de edición
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ ok: false, message: "ID de historia no válido" }, { status: 400 });
    }

    await connectDB();
    const story = await Story.findById(params.id);

    if (!story) {
      return NextResponse.json({ ok: false, message: "Historia no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: story });
  } catch (error: any) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }
}

// DELETE: Eliminar una historia
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 1. Proteger la ruta para que solo ADMINS puedan eliminar
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get("triton_session_token");
    if (!tokenCookie) throw new Error("Acceso denegado. Token no encontrado.");
    
    const token = jwt.verify(tokenCookie.value, process.env.JWT_SECRET!) as DecodedToken;
    if (!token || token.role !== "ADMIN") {
      return NextResponse.json({ ok: false, message: "No autorizado" }, { status: 401 });
    }

    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ ok: false, message: "ID de historia no válido" }, { status: 400 });
    }
    
    await connectDB();
    await Story.findByIdAndDelete(params.id);

    return NextResponse.json({ ok: true, message: "Historia eliminada" });
  } catch (error: any) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }
}

// PUT: Actualizar una historia existente
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 1. Proteger la ruta para que solo ADMINS puedan editar
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get("triton_session_token");
    if (!tokenCookie) throw new Error("Acceso denegado. Token no encontrado.");
    
    const token = jwt.verify(tokenCookie.value, process.env.JWT_SECRET!) as DecodedToken;
    if (!token || token.role !== "ADMIN") {
      return NextResponse.json({ ok: false, message: "No autorizado" }, { status: 401 });
    }

    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ ok: false, message: "ID de historia no válido" }, { status: 400 });
    }
    
    await connectDB();

    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    
    let imageUrl = formData.get("currentImage") as string || "";

    // Si se sube una nueva imagen, procesarla y subirla a Cloudinary
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result: any = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "triton_stories" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        Readable.from(buffer).pipe(uploadStream);
      });
      imageUrl = result.secure_url;
    }

    const updatedData = {
      title: formData.get("title"),
      author: formData.get("author"),
      content: formData.get("content"),
      image: imageUrl,
    };

    const updatedStory = await Story.findByIdAndUpdate(params.id, updatedData, { new: true });

    if (!updatedStory) {
      return NextResponse.json({ ok: false, message: "No se pudo encontrar la historia para actualizar" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: updatedStory }, { status: 200 });

  } catch (error: any) {
    console.error("🔥 ERROR EN /stories/[id] (PUT):", error);
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }
}