"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Users, CreditCard } from "lucide-react";
import { openRegistration } from "@/utils/registration";

export default function EventsSection() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        // Obtenemos solo los 3 eventos más próximos
        const res = await fetch("/api/events?limit=3");
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        }
      } catch (error) {
        console.error("Error cargando eventos para la sección principal:", error);
      }
    }
    fetchEvents();
  }, []);

  return (
    <section className="w-full" id="eventos">
      {/* CONTENEDOR PRINCIPAL – IGUAL QUE FEED */}
      <div className="max-w-6xl mx-auto px-4">
        {/* TITULO */}
        <div className="flex flex-col gap-3 mb-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/tritontransparente.png"
              alt="logo"
              className="h-7 w-7 object-contain"
            />
            <div>
              <h2 className="text-2xl font-bold">Eventos TRITON</h2>
              <p className="text-gray-400 text-sm">
                Próximas carreras, fondos y entrenamientos especiales
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            {/* A futuro: este botón puede ser solo para ADMIN */}
            <Link
              href="/events/create"
              className="inline-flex items-center gap-2 bg-gradient-to-br from-cyan-300 to-orange-300 text-black font-semibold px-4 py-2 rounded-full"
            >
              Crear evento (ADMIN)
            </Link>

            <Link
              href="/events/request"
              className="inline-flex items-center gap-2 border border-cyan-300/60 text-cyan-300 px-4 py-2 rounded-full bg-cyan-300/5"
            >
              Soy organizador, quiero publicar mi evento
            </Link>
          </div>
        </div>

        {/* LISTA DE EVENTOS */}
        <div className="space-y-6">
          {events.map((event) => (
            <article
              key={event.id}
              className="bg-[#111] border border-white/5 rounded-2xl px-4 py-4
                         flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              {/* IZQUIERDA */}
              <div className="flex items-start gap-3">
                <div
                  className="h-10 w-10 rounded-xl bg-gradient-to-br 
                                from-cyan-300 to-orange-300 
                                flex items-center justify-center"
                >
                  <Calendar className="text-black" size={22} />
                </div>

                <div>
                  <Link
                    href={`/events/${event._id}`}
                    className="text-sm font-semibold hover:underline text-white"
                  >
                    {event.name}
                  </Link>

                  <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(event.date).toLocaleDateString("es-CO", {
                        month: "long",
                        day: "numeric",
                      })} · {event.time}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={12} />
                      {event.location}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users size={12} />
                      Cupos: {event.slotsLeft}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-gray-300">
                    Distancia:{" "}
                    <span className="font-semibold">{event.distance}</span>
                  </p>
                </div>
              </div>

              {/* DERECHA */}
              <div className="flex flex-col items-end gap-2 text-xs">
                <Link
                  href={`/events/${event._id}`}
                  className="text-xs text-cyan-300 hover:underline font-semibold"
                >
                  Ver detalles
                </Link>

                <span className="px-2 py-1 rounded-full bg-white/5 text-gray-300">
                  {event.type}
                </span>

                <span className="inline-flex items-center gap-1 text-cyan-300 font-semibold">
                  <CreditCard size={12} />
                  {event.price}
                </span>

                <button
                  onClick={() => openRegistration(event.id, event.distance)}
                  className="mt-1 inline-flex items-center gap-2 bg-gradient-to-br 
                             from-cyan-300 to-orange-300 text-black 
                             font-semibold px-4 py-1.5 rounded-full"
                >
                  Inscribirme
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}