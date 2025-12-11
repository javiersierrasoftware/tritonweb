import { NextRequest, NextResponse } from "next/server";
import { handleOrder } from "@/lib/wompi-utils";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

interface DecodedToken {
  id: string;
  role: string;
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 1. Authenticate and Authorize Admin
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get("triton_session_token");
    if (!tokenCookie) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }
    
    const token = jwt.verify(tokenCookie.value, process.env.JWT_SECRET!) as DecodedToken;
    if (token.role !== "ADMIN") {
      return NextResponse.json({ message: "Acceso denegado" }, { status: 403 });
    }

    const orderId = params.id;
    if (!orderId) {
      return NextResponse.json({ message: "ID de la orden es requerido." }, { status: 400 });
    }

    console.log(`[Force Process] Manually processing order ${orderId} as 'APPROVED'.`);
    
    // 2. Call the centralized handler function, simulating a successful webhook
    await handleOrder(orderId, 'APPROVED', `MANUAL_APPROVAL_${new Date().toISOString()}`);

    return NextResponse.json({ message: `Orden ${orderId} procesada exitosamente como pagada.` }, { status: 200 });

  } catch (error: any) {
    console.error(`[Force Process] Error processing order:`, error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return NextResponse.json({ message: 'Token inválido o expirado' }, { status: 401 });
    }
    // Check if the error message is from our wompi-util
    if (error.message.includes("not found")) {
        return NextResponse.json({ message: error.message }, { status: 404 });
    }
    return NextResponse.json({ message: "Error interno del servidor.", error: error.message }, { status: 500 });
  }
}
