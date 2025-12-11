import { NextResponse } from "next/server";

/**
 * A FUTURO:
 * - Guardar la solicitud en BD
 * - Notificar por correo a ADMIN
 * - Panel para aprobar/rechazar
 */

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.organizerName || !body.organizerEmail || !body.name) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Nombre del organizador, correo y nombre del evento son obligatorios.",
        },
        { status: 400 }
      );
    }

    if (!body.acceptTerms) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Debes aceptar las condiciones y costos para enviar la solicitud.",
        },
        { status: 400 }
      );
    }

    const requestPayload = {
      ...body,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // A futuro: guardar en BD.
    console.log("📩 Nueva solicitud de publicación de evento:", requestPayload);

    return NextResponse.json(
      {
        ok: true,
        message:
          "Solicitud enviada. Un administrador revisará tu evento y se pondrá en contacto contigo.",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ Error al registrar solicitud de evento:", err);
    return NextResponse.json(
      { ok: false, message: "Error al registrar la solicitud" },
      { status: 500 }
    );
  }
}