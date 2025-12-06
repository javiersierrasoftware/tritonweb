import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ message: "Formato inválido" }, { status: 400 });
    }

    const objectIds = ids.map((id) => new ObjectId(id));

    const db = await getDb();
    await db.collection("stories").deleteMany({ _id: { $in: objectIds } });

    return NextResponse.json({ message: "Historias eliminadas" });
  } catch (err) {
    return NextResponse.json({ message: "Error eliminando historias" }, { status: 500 });
  }
}