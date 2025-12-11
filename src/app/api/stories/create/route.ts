import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import Story from "@/models/Story";
import { Readable } from "stream";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

interface DecodedToken {
  id: string;
  role: string;
  [key: string]: any;
}

export async function POST(req: Request) {
  console.log("📥 API /stories/create recibió solicitud");

  try {
    // -------------------------
    // 1️⃣ VERIFICAR SESIÓN DE ADMIN (MÉTODO MANUAL)
    // -------------------------
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get("triton_session_token");
    
    if (!tokenCookie) {
      throw new Error("No se encontró el token de sesión.");
    }

    const token = jwt.verify(tokenCookie.value, process.env.JWT_SECRET!) as DecodedToken;

    if (!token || token.role !== "ADMIN") {
      console.log("⛔ Usuario no autorizado o no es admin:", token);
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
    await connectDB();
    
    await Story.create({
      title: `${category} de ${user}`, // Título generado a partir de los datos
      content: description,
      author: user,
      image: imageUrl,
      // Los campos userTag y category no están en el modelo Story,
      // se podrían añadir al Schema si son necesarios.
      // timestamps: true en el modelo se encarga de createdAt.
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