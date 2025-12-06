import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// =========================
// GET STORY BY ID
// =========================
export async function GET(req: Request, { params }: any) {
  try {
    const db = await getDb();
    const story = await db
      .collection("stories")
      .findOne({ _id: new ObjectId(params.id) });

    if (!story) {
      return NextResponse.json(
        { message: "Historia no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(story);
  } catch (error) {
    return NextResponse.json(
      { message: "Error obteniendo historia" },
      { status: 500 }
    );
  }
}

// =========================
// UPDATE STORY
// =========================
export async function PUT(req: Request, { params }: any) {
  try {
    const { category, description } = await req.json();
    const db = await getDb();

    await db.collection("stories").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          category,
          description,
        },
      }
    );

    return NextResponse.json({ message: "Historia actualizada" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error actualizando historia" },
      { status: 500 }
    );
  }
}

// =========================
// DELETE STORY
// =========================
export async function DELETE(req: Request, { params }: any) {
  try {
    const db = await getDb();

    await db
      .collection("stories")
      .deleteOne({ _id: new ObjectId(params.id) });

    return NextResponse.json({ message: "Historia eliminada" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error eliminando historia" },
      { status: 500 }
    );
  }
}