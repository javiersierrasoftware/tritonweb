import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Story from "@/models/Story"; // Asumiendo que crearás un modelo Story

export const dynamic = 'force-dynamic'; // Ensures that this route is always dynamic and not statically optimized

export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const featuredOnly = url.searchParams.get("featured") === "1";

    let query = {};

    if (featuredOnly) {
      query = { featured: true };
    }

    // Usando el modelo de Mongoose
    const result = await Story
      .find(query)
      .sort({ createdAt: -1 })
      .limit(featuredOnly ? 3 : 1000);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error cargando historias:", error);
    return NextResponse.json([], { status: 500 });
  }
}