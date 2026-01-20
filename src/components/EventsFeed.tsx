"use client";

import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function EventsFeed() {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));

    fetch("/api/events?limit=3")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch(console.error);
  }, []);

  return (
    <section id="eventos">
      <div className="max-w-6xl mx-auto px-4">

        {/* HEADER */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-start gap-3">
            <img src="/tritontransparente.png" className="h-7 w-7" />

            <div>
              <h2 className="text-2xl font-bold">Eventos TRITON</h2>
              <p className="text-gray-400 text-sm">Próximos eventos</p>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event: any) => {

            const formatDate = (dateString: string) => {
              return new Date(dateString).toLocaleDateString("es-CO", {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC", // Fix timezone
              });
            };

            const formatTime = (timeStr?: string) => {
              if (!timeStr) return "";
              const [hours, minutes] = timeStr.split(":").map(Number);
              if (isNaN(hours) || isNaN(minutes)) return timeStr;
              const ampm = hours >= 12 ? "PM" : "AM";
              const h12 = hours % 12 || 12;
              return `${h12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
            };

            return (
              <article
                key={event._id}
                className="relative bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-md"
              >
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Calendar size={24} />
                    <h3 className="text-lg font-bold text-white">{event.name}</h3>
                  </div>
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold">Fecha:</span> {formatDate(event.date)}
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold">Hora:</span> {formatTime(event.time)}
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold">Lugar:</span> {event.location}
                  </p>

                  {/* PRECIO: Fix undefined display */}
                  {event.price !== undefined && event.price !== null && (
                    <p className="text-lg font-bold text-white">
                      {event.price === 0 ? "Gratis" : `$${event.price.toLocaleString('es-CO')}`}
                    </p>
                  )}
                </div>
                <div className="p-4 border-t border-white/10 flex justify-between items-center">
                  <Link href={`/events/${event._id}`} className="text-cyan-400 hover:underline text-sm">
                    Ver detalles
                  </Link>
                  <Link href={`/events/register/${event._id}`} className="bg-gradient-to-br from-cyan-300 to-orange-300 text-black px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90">
                    Inscribirme
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}