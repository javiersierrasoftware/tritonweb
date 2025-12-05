import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const TOKEN_COOKIE = "token"; // nombre estándar (el middleware lo usa)

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Correo y contraseña son obligatorios." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const users = db.collection("users");

    // Buscar usuario
    const user = await users.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Credenciales inválidas." },
        { status: 401 }
      );
    }

    // Validar contraseña
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { message: "Credenciales inválidas." },
        { status: 401 }
      );
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("Debes definir JWT_SECRET en las variables de entorno");
    }

    // Payload del usuario
    const payload = {
      sub: (user._id as ObjectId).toString(),
      email: user.email,
      name: user.name,
    };

    // Firmar token JWT
    const token = jwt.sign(payload, secret, { expiresIn: "7d" });

    // Respuesta JSON
    const response = NextResponse.json(
      {
        message: "Login exitoso",
        user: {
          id: payload.sub,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );

    // Guardar cookie (middleware la usa)
    response.cookies.set(TOKEN_COOKIE, token, {
      httpOnly: false, // si quieres usar httpOnly=true también te lo dejo listo
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    return response;

  } catch (err) {
    console.error("Error en login:", err);
    return NextResponse.json(
      { message: "Error interno al iniciar sesión." },
      { status: 500 }
    );
  }
}