import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const TOKEN_COOKIE = "triton_session_token"; // Cookie nueva y limpia

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Correo y contraseña son obligatorios" },
        { status: 400 }
      );
    }

    await connectDB();

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Validar contraseña
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Generar JWT
    const secret = process.env.JWT_SECRET!;
    const payload = {
      id: user._id.toString(), // 'id' es más estándar en los tokens de next-auth
      email: user.email,
      name: user.name,
      role: user.role ?? "USER", // cuidado aquí
    };

    const token = jwt.sign(payload, secret, { expiresIn: "7d" });

    const response = NextResponse.json({
      message: "Login exitoso",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role ?? "USER",
      },
    }, { status: 200 });

    // ==================================================
    //   BORRAR TOKEN ANTERIOR POR SI AÚN EXISTE
    // ==================================================
    response.cookies.set("token", "", {
      path: "/",
      maxAge: 0,
    });

    // ==================================================
    //   COLOCAR COOKIE NUEVA
    // ==================================================
    response.cookies.set(TOKEN_COOKIE, token, {
      httpOnly: true, // más seguro + fuerza a usar esta cookie
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    // Log para verificar que el rol llega OK
    console.log("🔵 LOGIN SUCCESS – USER FOUND:", {
      email: user.email,
      role: user.role,
      id: user._id.toString(),
    });

    return response;

  } catch (err) {
    console.error("Error en login:", err);
    return NextResponse.json(
      { message: "Error interno al iniciar sesión" },
      { status: 500 }
    );
  }
}