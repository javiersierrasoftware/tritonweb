import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  const connection = await connectDB();
  const db = connection.db;
  const stories = await db!
    .collection("stories")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json({ stories });
}