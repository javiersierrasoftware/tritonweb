import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Story from "@/models/Story";


export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "No autenticado" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Solo ADMIN puede modificar destacadas" }, { status: 403 });
    }

    await connectDB();

    const body = await req.json();
    const { featured } = body;

    const { id } = await params;

    const updatedStory = await Story.findByIdAndUpdate(
      id,
      { featured },
      { new: true }
    );

    if (!updatedStory) {
      return NextResponse.json({ message: "Historia no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ message: "Historia actualizada", story: updatedStory }, { status: 200 });
  } catch (error) {

    console.error(error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}