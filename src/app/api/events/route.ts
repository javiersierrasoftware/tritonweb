import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";

export const dynamic = 'force-dynamic'; // Ensures that this route is always dynamic and not statically optimized

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit");

    await connectDB();

    const query = Event.find({}).sort({ date: -1 });

    const events = limit ? await query.limit(Number(limit)) : await query;

    return NextResponse.json(events);
  } catch (error: any) {
    console.error("Error al cargar los eventos:", error);
    return NextResponse.json(
      { message: "Error interno al cargar los eventos", error: error.message },
      { status: 500 }
    );
  }
}
