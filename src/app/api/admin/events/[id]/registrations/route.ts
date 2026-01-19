export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

import { connectDB } from "@/lib/mongodb";
import Registration from "@/models/Registration";
import jwt from "jsonwebtoken";
import { isValidObjectId } from "mongoose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface DecodedToken {
  id: string;
  role: string;
  [key: string]: any;
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ message: "Acceso denegado" }, { status: 403 });
    }

    // 2. Validate Event ID
    const { id: eventId } = await params;
    if (!isValidObjectId(eventId)) {
      return NextResponse.json({ message: "Invalid event ID." }, { status: 400 });
    }

    await connectDB();

    // 3. Fetch Registrations for the Event
    const registrations = await Registration.find({ event: eventId })
      .populate("user", "name email") // Populate user details if linked
      .lean(); // Convert to plain JS objects

    // 4. Return Registrations
    return NextResponse.json({ ok: true, data: registrations }, { status: 200 });

  } catch (error: any) {
    console.error("🔥 ERROR in /api/admin/events/[id]/registrations:", error);
    return NextResponse.json({ message: error.message || "Internal server error." }, { status: 500 });
  }
}
