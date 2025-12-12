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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await authenticateAdmin();
    if (!admin) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    await connectDB();
    const { id } = params;

    const formData = await request.formData();
    const title = formData.get('title') as string | null;
    const subtitle = formData.get('subtitle') as string | null;
    const buttonLink = formData.get('buttonLink') as string | null;
    const order = formData.get('order') as string | null;
    const imageFile = formData.get('image') as File | null;

    let imageUrl: string | undefined;

    if (imageFile && imageFile.size > 0) {
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
      imageUrl = uploadResult.secure_url;

      if (!imageUrl) {
          return NextResponse.json({ message: "Fallo al subir la imagen" }, { status: 500 });
      }
    }

    const updateData: { [key: string]: any } = {};
    if (title) updateData.title = title;
    if (subtitle) updateData.subtitle = subtitle;
    if (buttonLink) updateData.buttonLink = buttonLink;
    if (order !== null) updateData.order = parseInt(order);
    if (imageUrl) updateData.image = imageUrl;

    if (Object.keys(updateData).length === 0) {
        return NextResponse.json({ message: "No se proporcionaron campos para actualizar" }, { status: 400 });
    }

    const updatedSlide = await HeroSlide.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedSlide) {
      return NextResponse.json({ message: "Hero slide no encontrada" }, { status: 404 });
    }

    return NextResponse.json(updatedSlide);
  } catch (error) {
    console.error("Error actualizando hero slide:", error);
    return NextResponse.json({ message: "Fallo al actualizar hero slide", error }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await authenticateAdmin();
    if (!admin) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    await connectDB();
    const { id } = params;
    const deletedSlide = await HeroSlide.findByIdAndDelete(id);

    if (!deletedSlide) {
      return NextResponse.json({ message: "Hero slide no encontrada" }, { status: 404 });
    }

    // Optionally, delete the image from Cloudinary
    // try {
    //   const publicId = deletedSlide.image.split('/').pop().split('.')[0];
    //   await cloudinary.uploader.destroy(`hero-slider/${publicId}`);
    // } catch (cloudinaryError) {
    //   console.error("Error deleting image from Cloudinary:", cloudinaryError);
    //   // Don't fail the whole request if only image deletion fails
    // }

    return NextResponse.json({ message: "Hero slide eliminada exitosamente" });
  } catch (error) {
    console.error("Error deleting hero slide:", error);
    return NextResponse.json({ message: "Fallo al eliminar hero slide", error }, { status: 500 });
  }
}