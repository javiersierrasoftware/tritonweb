import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Registration from "@/models/Registration";
import User from "@/models/User"; // Import the User model
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { isValidObjectId } from "mongoose";

interface DecodedToken {
  id: string;
  role: string;
  [key: string]: any;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 1. Authenticate and Authorize Admin
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get("triton_session_token");
    if (!tokenCookie) {
      return NextResponse.json({ message: "Unauthorized. Token not found." }, { status: 401 });
    }
    
    const token = jwt.verify(tokenCookie.value, process.env.JWT_SECRET!) as DecodedToken;
    if (!token || token.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden. Not an admin." }, { status: 403 });
    }

    // 2. Validate Event ID
    const eventId = params.id;
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
