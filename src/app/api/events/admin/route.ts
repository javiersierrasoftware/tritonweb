import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";
import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // 1. Proteger la ruta para que solo ADMINS puedan crear eventos
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ ok: false, message: "No autorizado." }, { status: 401 });
    }

    await connectDB();

    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    let imageUrl = "";
    if (file) {
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

    const name = formData.get("name") as string;

    // Función para crear un slug amigable para la URL
    const slugify = (str: string) =>
      str.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");

    // Generar y asegurar que el slug sea único
    let baseSlug = slugify(name);
    let slug = baseSlug;
    let counter = 1;
    while (await Event.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    // 2. Crear y guardar el evento en la base de datos
    const newEvent = new Event({
      name: name,
      slug: slug,
      description: formData.get("description") as string,
      date: new Date(formData.get("date") as string),
      time: formData.get("time") as string,
      location: formData.get("location") as string,
      type: formData.get("type") as string,
      distance: formData.get("distance") as string,
      distances: distances ? distances.split(",").map((d) => d.trim()) : [],
      minAge: Number(formData.get("minAge")) || undefined,
      maxAge: Number(formData.get("maxAge")) || undefined,
      price: Number(formData.get("price")) || 0,
      slotsLeft: Number(formData.get("slotsLeft")) || 0,
      category: JSON.parse((formData.get("category") as string) || "[]"),
      shirtSizes: shirtSizes ? JSON.parse(shirtSizes) : [],
      registrationPeriods: registrationPeriods ? JSON.parse(registrationPeriods) : [],
      image: imageUrl,
      createdBy: (session.user as any).id,
    });

    await newEvent.save();

    return NextResponse.json({ ok: true, data: newEvent }, { status: 201 });
  } catch (error: any) {
    console.error("🔥 ERROR EN /events/admin:", error);
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }
}
