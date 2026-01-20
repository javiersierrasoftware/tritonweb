"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Trash2, Pencil, Search, Plus, Users } from "lucide-react";
import Link from "next/link";

export default function ManageEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Cargar eventos
  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filtrar eventos
  const filteredEvents = events.filter(
    (e) =>
      (e.name && e.name.toLowerCase().includes(search.toLowerCase())) ||
      (e.location && e.location.toLowerCase().includes(search.toLowerCase()))
  );

  // Eliminar un evento
  const deleteOne = async (id: string) => {
    try {
      const res = await fetch(`/api/events/admin/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo eliminar el evento.");

      setEvents((prev) => prev.filter((e) => e._id !== id));
      setConfirmDeleteId(null);
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el evento.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC", // Fix timezone
    });
  };

  if (loading) {
    return <div className="text-center py-20">Cargando eventos...</div>;
  }

  return (
    <div className="space-y-6">
      {/* ENCABEZADO */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 bg-black border border-white/10 px-3 py-2 rounded-lg w-full md:w-1/3">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o ubicación..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm text-white w-full"
          />
        </div>

        <Link
          href="/events/create"
          className="flex items-center gap-2 bg-gradient-to-br from-cyan-300 to-orange-300 text-black px-4 py-2 rounded-full font-semibold text-sm shadow-md"
        >
          <Plus size={18} /> Crear Evento
        </Link>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div
            key={event._id}
            className="relative bg-[#111] border border-white/5 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition"
          >
            {/* Acciones */}
            <div className="absolute top-2 right-2 flex gap-2 z-10 bg-black/50 p-1 rounded-lg">
              <Link href={`/admin/events/${event._id}/registrations`} title="Ver Inscripciones">
                <Users size={18} className="text-white hover:text-purple-300" />
              </Link>
              <Link href={`/events/edit/${event._id}`} title="Editar Evento">
                <Pencil size={18} className="text-white hover:text-cyan-300" />
              </Link>
              <button onClick={() => setConfirmDeleteId(event._id)} title="Eliminar Evento">
                <Trash2 size={18} className="text-red-400 hover:text-red-300" />
              </button>
            </div>

            <div className="relative w-full h-48 bg-black rounded-t-xl overflow-hidden">
              <Image
                src={event.image || "/event-placeholder.jpg"}
                alt={event.name}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>

            <div className="p-4">
              <p className="font-semibold text-white">{event.name}</p>
              <p className="text-sm mt-1 text-gray-400">
                {formatDate(event.date)}
              </p>
              <p className="text-xs text-gray-500">{event.location}</p>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL ELIMINAR */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-[#111] p-6 rounded-xl border border-white/10 max-w-sm">
            <h3 className="text-lg font-bold mb-3">Eliminar Evento</h3>
            <p className="text-gray-300 mb-6">
              ¿Estás seguro de eliminar este evento? Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 rounded-lg bg-white/10"
              >
                Cancelar
              </button>

              <button
                onClick={() => deleteOne(confirmDeleteId)}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
