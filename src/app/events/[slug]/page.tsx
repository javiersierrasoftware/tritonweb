import { notFound } from "next/navigation";
import Image from "next/image";
import { CalendarDays, MapPin, Clock, CreditCard, Users } from "lucide-react";
import { EVENTS } from "@/data/events";

export default function EventDetail({ params }: { params: { slug: string } }) {
  const event = EVENTS.find((e) => e.id === params.slug);

  if (!event) return notFound();

  return (
    <div className="min-h-screen pb-20">
      {/* Banner */}
      <div className="relative w-full h-72 md:h-96">
        <Image
          src={event.image}
          alt={event.name}
          fill
          className="object-cover opacity-80"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />

        <h1 className="absolute bottom-6 left-6 text-3xl font-bold">
          {event.name}
        </h1>
      </div>

      {/* Info principal */}
      <section className="max-w-4xl mx-auto px-4 mt-8 space-y-6">

        {/* Datos generales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="bg-[#111] border border-white/10 p-4 rounded-xl">
            <p className="flex items-center gap-2 text-sm">
              <CalendarDays size={18} className="text-orange-300" />
              {event.date} — {event.time}
            </p>
          </div>

          <div className="bg-[#111] border border-white/10 p-4 rounded-xl">
            <p className="flex items-center gap-2 text-sm">
              <MapPin size={18} className="text-cyan-300" />
              {event.location}
            </p>
          </div>

          <div className="bg-[#111] border border-white/10 p-4 rounded-xl">
            <p className="flex items-center gap-2 text-sm">
              <Users size={18} className="text-pink-300" />
              Cupos disponibles: {event.slotsLeft}
            </p>
          </div>

          <div className="bg-[#111] border border-white/10 p-4 rounded-xl">
            <p className="flex items-center gap-2 text-sm">
              <CreditCard size={18} className="text-green-300" />
              Costo: {event.price}
            </p>
          </div>
        </div>

        {/* Descripción */}
        <div className="bg-[#111] p-5 rounded-xl border border-white/10">
          <h2 className="text-lg font-semibold mb-2">Descripción</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Distancia */}
        <div className="bg-[#111] p-5 rounded-xl border border-white/10">
          <h2 className="text-lg font-semibold mb-2">Distancia / Categoría</h2>
          <p className="text-gray-300 text-sm">{event.distance}</p>
        </div>

        {/* Botón de inscripción */}
        <div className="flex justify-center pt-4">
          <a
            href="/#eventos"
            className="bg-gradient-to-br from-cyan-300 to-orange-300 text-black font-bold px-6 py-2 rounded-full shadow-lg"
          >
            Inscribirme ahora
          </a>
        </div>
      </section>
    </div>
  );
}