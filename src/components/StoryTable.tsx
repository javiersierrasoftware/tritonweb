"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";

export default function StoryTable({
  onEdit,
  onDelete,
  onBulkDelete,
}: any) {
  const [stories, setStories] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const perPage = 6;

  useEffect(() => {
    fetch("/api/stories")
      .then((res) => res.json())
      .then((data) =>
        setStories(
          data.sort(
            (a: any, b: any) => b.createdAt.localeCompare(a.createdAt)
          )
        )
      );
  }, []);

  const filtered = stories.filter(
    (s: any) =>
      s.user.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">

      {/* 🔍 BUSCADOR + ELIMINACIÓN MASIVA */}
      <div className="flex justify-between items-center">
        <input
          placeholder="Buscar historia..."
          className="bg-black border border-white/10 rounded-lg px-3 py-2 w-64 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {selected.length > 0 && (
          <button
            onClick={() => onBulkDelete(selected)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold"
          >
            Eliminar seleccionadas ({selected.length})
          </button>
        )}
      </div>

      {/* 🖼️ GRID DE HISTORIAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {paginated.map((story: any) => (
          <div
            key={story._id}
            className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-lg shadow-black/20 hover:shadow-black/30 transition"
          >

            {/* 🎨 IMAGEN — MISMO ESTILO QUE FEED */}
            <div className="relative w-full h-80 bg-black rounded-t-2xl overflow-hidden">
              <Image
                src={story.image}
                alt={story.user}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>

            {/* CONTENIDO */}
            <div className="p-4 space-y-2">

              {/* USER + CATEGORY */}
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold text-sm">{story.user}</p>
                  <p className="text-gray-400 text-xs">{story.userTag}</p>
                </div>

                <span className="px-3 py-1 bg-white/5 text-xs rounded-full">
                  {story.category}
                </span>
              </div>

              {/* DESCRIPTION */}
              <p className="text-gray-300 text-sm line-clamp-2">
                {story.description}
              </p>

              {/* ACCIONES */}
              <div className="flex justify-between items-center pt-2">
                <button onClick={() => onEdit(story)}>
                  <Pencil
                    size={18}
                    className="text-blue-300 hover:text-blue-200 transition"
                  />
                </button>

                <button onClick={() => onDelete([story._id])}>
                  <Trash2
                    size={18}
                    className="text-red-400 hover:text-red-300 transition"
                  />
                </button>

                <input
                  type="checkbox"
                  checked={selected.includes(story._id)}
                  onChange={() => toggleSelect(story._id)}
                  className="h-5 w-5 accent-cyan-400 cursor-pointer"
                />
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* PAGINACIÓN */}
      <div className="flex justify-center gap-3 pt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 rounded-lg bg-white/10 disabled:opacity-20"
        >
          ←
        </button>

        <button
          disabled={page * perPage >= filtered.length}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 rounded-lg bg-white/10 disabled:opacity-20"
        >
          →
        </button>
      </div>
    </div>
  );
}