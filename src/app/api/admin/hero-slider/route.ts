import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import HeroSlide from '@/models/HeroSlide';
import cloudinary from "@/lib/cloudinary";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

interface DecodedToken {
  id: string;
  role: string;
  [key: string]: any;
}

// Helper function for authentication
async function authenticateAdmin() {
  const cookieStore = cookies();
  const tokenCookie = cookieStore.get("triton_session_token");
  if (!tokenCookie) {
    return null;
  }
  
  try {
    const token = jwt.verify(tokenCookie.value, process.env.JWT_SECRET!) as DecodedToken;
    if (token && token.role === "ADMIN") {
      return token;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function GET() {
  try {
    await connectDB();
    const slides = await HeroSlide.find({}).sort({ order: 1 });
    return NextResponse.json(slides);
  } catch (error) {
    console.error("Error fetching hero slides:", error);
    return NextResponse.json({ message: "Fallo al obtener hero slides", error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await authenticateAdmin();
    if (!admin) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    await connectDB();

    const formData = await request.formData();

    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const buttonLink = formData.get('buttonLink') as string;
    const order = formData.get('order') as string;
    const imageFile = formData.get('image') as File;

    if (!title || !subtitle || !buttonLink || !order || !imageFile || imageFile.size === 0) {
      return NextResponse.json({ message: "Faltan campos obligatorios o imagen" }, { status: 400 });
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const public_id = uuidv4();
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "hero-slider",
          public_id: public_id,
          resource_type: "image",
        },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );
      uploadStream.end(buffer);
    }) as { secure_url: string };
    
    const imageUrl = uploadResult.secure_url;

    if (!imageUrl) {
        return NextResponse.json({ message: "Fallo al subir la imagen" }, { status: 500 });
    }

    const newSlide = await HeroSlide.create({
      title,
      subtitle,
      buttonLink,
      order: parseInt(order),
      image: imageUrl,
    });

    return NextResponse.json(newSlide, { status: 201 });
  } catch (error) {
    console.error("Error creando hero slide:", error);
    return NextResponse.json({ message: "Fallo al crear hero slide", error }, { status: 500 });
  }
}
