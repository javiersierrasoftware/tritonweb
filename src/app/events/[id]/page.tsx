import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";
import Image from "next/image";
import { isValidObjectId } from "mongoose";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { Calendar, Clock, MapPin, Tag, Users, Award, Pencil, CreditCard } from "lucide-react";
import RegistrationButton from "@/components/events/RegistrationButton";
import QRCode from 'react-qr-code';

interface DecodedToken {
  id: string;
  role: string;
  [key: string]: any;
}

interface EventDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getEvent(id: string) {
  if (!isValidObjectId(id)) {
    return null;
  }
  await connectDB();
  // lean() convierte el documento de Mongoose a un objeto JS plano
  const event = await Event.findById(id).lean();
  return event;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  const event = await getEvent(id);

  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("triton_session_token");
  let isAdmin = false;
  let isLoggedIn = false;

  if (tokenCookie) {
    try {
      const token = jwt.verify(tokenCookie.value, process.env.JWT_SECRET!) as DecodedToken;
      if (token.role === "ADMIN") {
        isAdmin = true;
      }
      isLoggedIn = true;
    } catch (error) {
      // Token inválido o expirado, el usuario no es admin
    }
  }

  if (!event) {
    notFound();
  }

  /* ------------------- FORMATEO DE FECHA (UTC) ------------------- */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC", // Forzar UTC para evitar desfase de día
    });
  };

  /* ------------------- FORMATEO DE HORA (AM/PM) ------------------- */
  const formatTime = (timeStr?: string) => {
    if (!timeStr) return "";
    // Se asume formato "HH:mm" (24h)
    const [hours, minutes] = timeStr.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return timeStr;

    const ampm = hours >= 12 ? "PM" : "AM";
    const h12 = hours % 12 || 12;
    return `${h12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  /* ------------------- URL DINÁMICA PARA QR ------------------- */
  // Priorizar variable de entorno si existe (para forzar dominio en prod o pruebas),
  // de lo contrario usar headers para detección automática.
  const { headers } = await import("next/headers");
  const headersData = await headers();

  let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl || baseUrl.includes("localhost")) {
    const host = headersData.get("host") || "localhost:3000";
    const protocol = headersData.get("x-forwarded-proto") || "http";
    baseUrl = `${protocol}://${host}`;
  }

  // Si el usuario quiere forzar triton-tri.com en local, debería configurar NEXT_PUBLIC_BASE_URL.
  // Pero para despliegue automático, la detección por headers es lo más robusto si la var no está.

  return (
    <main className="pb-20">
      {/* Banner */}
      <div className="relative w-full h-[50vh] bg-black">
        <Image
          src={event.image || "/event-placeholder.jpg"}
          alt={event.name}
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 flex items-end max-w-6xl mx-auto p-8">
          <div className="text-white space-y-2">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-cyan-400 text-black">
              {event.type}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold">{event.name}</h1>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Columna principal */}
        <div className="md:col-span-2 space-y-8">
          <h2 className="text-2xl font-bold">Descripción del Evento</h2>
          <p className="text-gray-300 whitespace-pre-wrap">
            {event.description || "No hay descripción disponible."}
          </p>

          {event.distances && event.distances.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-3">Distancias</h3>
              <div className="flex flex-wrap gap-3">
                {event.distances.map((d: string) => (
                  <span key={d} className="px-3 py-1 text-sm rounded-full bg-white/10 border border-white/20">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Columna lateral */}
        <aside className="space-y-6 bg-[#111] border border-white/10 rounded-2xl p-6 h-fit">
          <RegistrationButton eventId={event._id.toString()} eventDistance={event.distance} isLoggedIn={isLoggedIn} />

          <div className="flex flex-col items-center justify-center gap-2 pt-4 border-t border-white/10">
            <h3 className="text-lg font-semibold text-white">Inscríbete escaneando</h3>
            <p className="text-sm text-gray-400 text-center mb-2">Escanea este código QR para ir al formulario de inscripción.</p>
            <div className="p-2 bg-white rounded-xl">
              <QRCode
                value={`${baseUrl}/events/register/${event._id.toString()}`}
                size={160}
                level="M"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Calendar className="text-cyan-300" size={24} />
            <div>
              <p className="font-bold capitalize">{formatDate(event.date.toISOString())}</p>
              <p className="text-sm text-gray-400">{formatTime(event.time)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <MapPin className="text-cyan-300" size={24} />
            <p>{event.location}</p>
          </div>

          {/* PRECIO: Mostrar Gratis si es 0, ocultar si undefined/null */}
          {event.price !== undefined && event.price !== null && (
            <div className="flex items-center gap-4">
              <Tag className="text-cyan-300" size={24} />
              <p className="font-semibold text-white">
                {event.price === 0
                  ? "Gratis"
                  : `$${event.price.toLocaleString("es-CO")}`}
              </p>
            </div>
          )}

          {event.slotsLeft > 0 && (
            <div className="flex items-center gap-4">
              <Users className="text-cyan-300" size={24} />
              <p>{event.slotsLeft} cupos disponibles</p>
            </div>
          )}
          {/* CATEGORÍAS CORRECTAS */}
          {Array.isArray(event.category) && event.category.length > 0 && (
            <div className="flex items-start gap-4">
              <Award className="text-cyan-300" size={24} />
              <div className="flex flex-wrap gap-2">
                {[...new Set<string>(event.category)].map((cat: string) => (
                  <span key={cat} className="px-3 py-1 text-xs rounded-full bg-white/10 border border-white/20">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
