import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";

// Helper para simular la obtención de la sesión (reemplazar con tu lógica real, ej. next-auth)
async function getServerSession(req: Request) {
  const { headers } = req;
  const cookie = headers.get('cookie');
  if (!cookie) return null;

  const tokenCookie = cookie.split(';').find(c => c.trim().startsWith('triton_session_token='));
  if (!tokenCookie) return null;

  const token = tokenCookie.split('=')[1];
  const jwt = require("jsonwebtoken");
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  try {
    const decoded = jwt.verify(token, secret);
    return { user: decoded };
  } catch (error) {
    return null;
  }
}

export async function POST(req: Request) {
  console.log("📥 API /stories/create recibió solicitud");

  try {
    // -------------------------
    // 1️⃣ VERIFICAR SESIÓN DE ADMIN
    // -------------------------
    const session = await getServerSession(req);

    if (!session || (session.user as any).role !== "ADMIN") {
      console.log("⛔ Usuario no autorizado o no es admin:", session?.user);
      return NextResponse.json(
        { message: "Acceso denegado. Solo ADMIN puede crear historias." },
        { status: 403 }
      );
    }
    console.log("✅ Usuario ADMIN autorizado");

    // -------------------------------------
    // 2️⃣ LEER FORM DATA DEL REQUEST
    // -------------------------------------
    const form = await req.formData();

    const user = form.get("user")?.toString() || "";
    const userTag = form.get("userTag")?.toString() || "";
    const category = form.get("category")?.toString() || "";
    const description = form.get("description")?.toString() || "";
    const file = form.get("image") as File | null;

    if (!file) {
      console.log("❌ No se recibió archivo");
      return NextResponse.json(
        { message: "Debe subir una imagen" },
        { status: 400 }
      );
    }

    // ---------------------------------
    // 3️⃣ SUBIR IMAGEN A CLOUDINARY
    // ---------------------------------
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "triton_stories",
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

    const imageUrl = result.secure_url;
    console.log("📸 Imagen subida a Cloudinary:", imageUrl);

    // -------------------------------------
    // 4️⃣ GUARDAR HISTORIA EN MONGODB
    // -------------------------------------
    const db = await getDb();
    const stories = db.collection("stories");

    await stories.insertOne({
      user,
      userTag,
      category,
      description,
      image: imageUrl,
      createdAt: new Date(),
    });

    console.log("✅ Historia guardada correctamente en MongoDB");

    return NextResponse.json(
      { message: "Historia creada exitosamente" },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("🔥 ERROR EN /stories/create:", error);
    return NextResponse.json(
      {
        message: "Error interno creando la historia",
        error: error.message,
      },
      { status: 500 }
    );
  }
}