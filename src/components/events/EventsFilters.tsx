"use client";

import { useState } from "react";

interface EventsFiltersProps {
  onFilterChange: (filters: {
    search: string;
    type: string;
    city: string;
  }) => void;
}

export default function EventsFilters({ onFilterChange }: EventsFiltersProps) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [city, setCity] = useState("");

  const handleUpdate = () => {
    onFilterChange({ search, type, city });
  };

  return (
    <div className="bg-[#111] border border-white/10 rounded-2xl p-5 mb-6 space-y-4">
      <h3 className="text-lg font-semibold">Filtrar eventos</h3>

      {/* BUSCADOR */}
      <div>
        <input
          type="text"
          placeholder="Buscar evento..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            handleUpdate();
          }}
          className="w-full bg-black/30 border border-white/10 text-white rounded-xl px-4 py-2"
        />
      </div>

      {/* SELECT TIPO */}
      <div>
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            handleUpdate();
          }}
          className="w-full bg-black/30 border border-white/10 text-white rounded-xl px-4 py-2"
        >
          <option value="">Tipo de evento</option>
          <option value="Carrera">Carrera</option>
          <option value="Triatlón">Triatlón</option>
          <option value="Entrenamiento">Entrenamiento</option>
        </select>
      </div>

      {/* SELECT CIUDAD */}
      <div>
        <select
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            handleUpdate();
          }}
          className="w-full bg-black/30 border border-white/10 text-white rounded-xl px-4 py-2"
        >
          <option value="">Ciudad</option>
          <option value="Sincelejo">Sincelejo</option>
          <option value="Santa Marta">Santa Marta</option>
          <option value="Ruta Caribe">Ruta Caribe</option>
        </select>
      </div>
    </div>
  );
}