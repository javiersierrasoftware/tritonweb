export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface DecodedToken {
  id: string;
  role: string;
  [key: string]: any;
}

export async function GET(req: NextRequest) {
  try {
    // 1. Authenticate and Authorize Admin
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get("triton_session_token");
    if (!tokenCookie) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const token = jwt.verify(
      tokenCookie.value,
      process.env.JWT_SECRET!
    ) as DecodedToken;

    if (!token || token.role !== "ADMIN") {
      return NextResponse.json({ message: "Acceso denegado" }, { status: 403 });
    }

    await connectDB();

    // 2. Handle Filters
    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year");
    const month = searchParams.get("month");
    console.log(`[Admin Orders] Fetching for Year: ${year}, Month: ${month}`);

    let dateFilter: any = {};
    if (year && month) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
      dateFilter = {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      };
    }

    const queryFilter = {
      ...dateFilter,
    };

    console.log("[Admin Orders] Using filter:", JSON.stringify(queryFilter, null, 2));

    // 3. Fetch All Orders for the period
    const orders = await Order.find(queryFilter)
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .lean();

    console.log(`[Admin Orders] Found ${orders.length} orders.`);

    // 4. Return Orders
    return NextResponse.json(orders, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return NextResponse.json({ message: "Token inválido o expirado" }, { status: 401 });
    }
    return NextResponse.json(
      { message: "Error interno del servidor", error: error.message },
      { status: 500 }
    );
  }
}
