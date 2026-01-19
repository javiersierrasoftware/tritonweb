import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendWelcomeEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { name, email, password, discipline, goal } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Nombre, correo y contraseña son obligatorios." },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: "Ya existe un usuario registrado con ese correo." },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashed,
      discipline: discipline || null,
      goal: goal || null,
    });

    // Enviar correo de bienvenida (no bloqueante)
    sendWelcomeEmail(email, name).catch(console.error);

    return NextResponse.json(
      { message: "Usuario registrado correctamente", userId: newUser._id },
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