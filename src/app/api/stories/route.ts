import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const featuredOnly = url.searchParams.get("featured") === "1";

    const db = await getDb();
    const stories = db.collection("stories");

    let query = {};

    if (featuredOnly) {
      query = { featured: true };
    }

    const result = await stories
      .find(query)
      .sort({ createdAt: -1 })
      .limit(featuredOnly ? 3 : 1000)
      .toArray();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error cargando historias:", error);
    return NextResponse.json([], { status: 500 });
  }
}