import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Aquí a futuro:
    // - Guardar en BD (Prisma / PostgreSQL)
    // - Enviar correo de confirmación
    // - Integrar pasarela de pagos

    console.log("Nueva inscripción a evento TRITON:", body);

    return NextResponse.json(
      {
        ok: true,
        message: "Inscripción registrada correctamente",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error registrando inscripción:", err);
    return NextResponse.json(
      {
        ok: false,
        message: "Error al registrar la inscripción",
      },
      { status: 500 }
    );
  }
}