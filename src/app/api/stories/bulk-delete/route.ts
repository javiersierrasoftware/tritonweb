import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ message: "Formato inválido" }, { status: 400 });
    }

    const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));

    const connection = await connectDB();
    const db = connection.db;
    await db!.collection("stories").deleteMany({ _id: { $in: objectIds } });

    return NextResponse.json({ message: "Historias eliminadas" });
  } catch (err) {
    return NextResponse.json({ message: "Error eliminando historias" }, { status: 500 });
  }
}