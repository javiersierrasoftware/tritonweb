import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Registration from "@/models/Registration";
import { isValidObjectId } from "mongoose";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();

  const { id } = await params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ message: "Invalid registration ID." }, { status: 400 });
  }

  try {
    const registration = await Registration.findById(id).select("status event");

    if (!registration) {
      return NextResponse.json({ message: "Registration not found." }, { status: 404 });
    }

    return NextResponse.json(registration);

  } catch (error) {
    console.error("Failed to fetch registration status:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
