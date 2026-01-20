"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, MapPin, Search } from "lucide-react";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events");
        if (!res.ok) {
          throw new Error("No se pudieron cargar los eventos.");
        }
        const data = await res.json();
        setEvents(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
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

  // Filtrar eventos según el término de búsqueda
  const filteredEvents = events.filter(
    (event) =>
      (event.name && event.name.toLowerCase().includes(search.toLowerCase())) ||
      (event.location && event.location.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return <div className="text-center py-40">Cargando eventos...</div>;
  }

  if (error) {
    return <div className="text-center py-40 text-red-400">Error: {error}</div>;
  }

  return (
    <main className="max-w-6xl mx-auto px-4 pt-28 pb-16 space-y-12">
      <header>
        <h1 className="text-4xl font-bold">Próximos Eventos</h1>
        <p className="text-gray-400 mt-2">
          Descubre las carreras, entrenamientos y competencias que vienen.
        </p>
      </header>

      {/* Barra de Búsqueda */}
      <div className="flex items-center gap-2 bg-black/50 border border-white/10 px-4 py-2 rounded-xl w-full md:w-1/2">
        <Search size={20} className="text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nombre o ubicación..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none text-sm text-white w-full"
        />
      </div>

      <div className="space-y-8">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Link
              href={`/events/${event._id}`}
              key={event._id}
              className="flex flex-col md:flex-row gap-6 bg-[#111] border border-white/10 rounded-2xl p-4 hover:border-cyan-400/50 transition-all duration-300"
            >
              <div className="relative w-full md:w-1/3 h-56 rounded-xl overflow-hidden">
                <Image
                  src={event.image || "/event-placeholder.jpg"}
                  alt={event.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 space-y-3">
                <h2 className="text-2xl font-bold text-white">{event.name}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-300">
                  <span className="flex items-center gap-2">
                    <Calendar size={16} /> {formatDate(event.date)}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock size={16} /> {formatTime(event.time)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <MapPin size={16} /> {event.location}
                </div>
                <p className="text-gray-400 text-sm pt-2 line-clamp-2">
                  {event.description}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-400 py-20">
            No hay eventos programados por el momento.
          </p>
        )}
      </div>
    </main>
  );
}