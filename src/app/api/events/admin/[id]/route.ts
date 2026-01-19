import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";
import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";
import { isValidObjectId } from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: Obtener los datos de un evento para el formulario de edición

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ ok: false, message: "ID de evento no válido" }, { status: 400 });
    }

    await connectDB();
    const event = await Event.findById(id);

    if (!event) {
      return NextResponse.json({ ok: false, message: "Evento no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: event });
  } catch (error: any) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    }
    await connectDB();
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ ok: false, message: "ID de evento no válido" }, { status: 400 });
    }

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

    const updatedEvent = await Event.findByIdAndUpdate(id, updatedData, { new: true });

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
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    }

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ ok: false, message: "ID de evento no válido" }, { status: 400 });
    }

    await connectDB();
    await Event.findByIdAndDelete(id);

    return NextResponse.json({ ok: true, message: "Evento eliminado" });
  } catch (error: any) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }
}
