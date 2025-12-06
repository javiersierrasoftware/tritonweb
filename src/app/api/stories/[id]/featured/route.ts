import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.headers.get("cookie")?.split("triton_session_token=")[1];
    if (!token) return NextResponse.json({ message: "No autenticado" }, { status: 401 });

    const secret = process.env.JWT_SECRET!;
    const user = jwt.verify(token, secret) as any;

    if (user.role !== "ADMIN") {
      return NextResponse.json({ message: "Solo ADMIN puede modificar destacadas" }, { status: 403 });
    }

    const db = await getDb();
    const stories = db.collection("stories");

    const body = await req.json();
    const { featured } = body;

    await stories.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { featured } }
    );

    return NextResponse.json({ message: "Historia actualizada" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}