import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";
import jwt from "jsonwebtoken";
import cloudinary from "@/lib/cloudinary";
import { cookies } from "next/headers";
import { Readable } from "stream";
import { isValidObjectId } from "mongoose";

interface DecodedToken {
  id: string;
  role: string;
  [key: string]: any;
}

// GET: Obtener los datos de un evento para el formulario de edición
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ ok: false, message: "ID de evento no válido" }, { status: 400 });
    }

    await connectDB();
    const event = await Event.findById(params.id);

    if (!event) {
      return NextResponse.json({ ok: false, message: "Evento no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: event });
  } catch (error: any) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }
}

// PUT: Actualizar un evento existente
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
      return NextResponse.json({ ok: false, message: "ID de evento no válido" }, { status: 400 });
    }
    
    await connectDB();

    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    
    let imageUrl = formData.get("currentImage") as string || "";

    // Si se sube una nueva imagen, procesarla y subirla a Cloudinary
    if (file && typeof file !== 'string') {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result: any = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "triton_events" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        Readable.from(buffer).pipe(uploadStream);
      });
      imageUrl = result.secure_url;
    }

    const distances = formData.get("distances") as string;
    const shirtSizes = formData.get("shirtSizes") as string;
    const registrationPeriods = formData.get("registrationPeriods") as string;

    const updatedData = {
      name: formData.get("name"),
      description: formData.get("description"),
      date: new Date(formData.get("date") as string),
      time: formData.get("time"),
      location: formData.get("location"),
      type: formData.get("type"),
      distance: formData.get("distance"),
      distances: distances ? distances.split(",").map((d) => d.trim()) : [],
      minAge: Number(formData.get("minAge")) || undefined,
      maxAge: Number(formData.get("maxAge")) || undefined,
      price: formData.get("price"),
      slotsLeft: Number(formData.get("slotsLeft")) || 0,
      category: JSON.parse((formData.get("category") as string) || "[]"),
      shirtSizes: shirtSizes ? JSON.parse(shirtSizes) : [],
      registrationPeriods: registrationPeriods ? JSON.parse(registrationPeriods) : [],
      image: imageUrl,
    };

    const updatedEvent = await Event.findByIdAndUpdate(params.id, updatedData, { new: true });

    if (!updatedEvent) {
      return NextResponse.json({ ok: false, message: "No se pudo encontrar el evento para actualizar" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: updatedEvent }, { status: 200 });

  } catch (error: any) {
    console.error("🔥 ERROR EN /events/admin/[id]:", error);
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }
}

// DELETE: Eliminar un evento
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
      return NextResponse.json({ ok: false, message: "ID de evento no válido" }, { status: 400 });
    }
    
    await connectDB();
    await Event.findByIdAndDelete(params.id);

    return NextResponse.json({ ok: true, message: "Evento eliminado" });
  } catch (error: any) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }
}
