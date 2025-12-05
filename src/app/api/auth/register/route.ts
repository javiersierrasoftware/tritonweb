import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { name, email, password, discipline, goal } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Nombre, correo y contraseña son obligatorios." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const users = db.collection("users");

    const existing = await users.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: "Ya existe un usuario registrado con ese correo." },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const now = new Date();
    const result = await users.insertOne({
      name,
      email,
      password: hashed,
      discipline: discipline || null,
      goal: goal || null,
      createdAt: now,
    });

    return NextResponse.json(
      { message: "Usuario registrado correctamente", userId: result.insertedId },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error en registro:", err);
    return NextResponse.json(
      { message: "Error interno al registrar usuario." },
      { status: 500 }
    );
  }
}