import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  const db = await getDb();
  const stories = await db
    .collection("stories")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json({ stories });
}