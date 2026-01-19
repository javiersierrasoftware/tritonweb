import { NextRequest, NextResponse } from "next/server";
import { handleOrder } from "@/lib/wompi-utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface DecodedToken {
  id: string;
  role: string;
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 1. Authenticate and Authorize Admin
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const { id: orderId } = await params;
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
