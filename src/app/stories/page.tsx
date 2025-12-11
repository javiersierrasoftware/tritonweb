"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function PublicStoriesPage() {
  const [stories, setStories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const itemsPerPage = 9; // mostrar 9 como galería

  // Cargar historias
  useEffect(() => {
    fetch("/api/stories")
      .then((res) => res.json())
      .then((data) =>
        setStories(data.sort((a: any, b: any) => b.createdAt.localeCompare(a.createdAt)))
      )
      .catch(console.error);
  }, []);

  // Filtrar
  const filtered = stories.filter(
    (s) =>
      (s.author && s.author.toLowerCase().includes(search.toLowerCase())) ||
      (s.content && s.content.toLowerCase().includes(search.toLowerCase())) ||
      (s.title && s.title.toLowerCase().includes(search.toLowerCase()))
  );

  // Paginación
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <main className="max-w-6xl mx-auto px-4 pt-28 pb-16 space-y-8">

      {/* TÍTULO */}
      <h1 className="text-3xl font-bold">Historias de la Comunidad</h1>
      <p className="text-gray-400">Publicaciones de corredores, ciclistas y nadadores.</p>

      {/* BUSCADOR */}
      <div className="flex justify-between items-center mt-4">
        <input
          type="text"
          placeholder="Buscar historias..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="bg-black border border-white/10 px-4 py-2 rounded-lg w-64 text-sm text-white"
        />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {paginated.map((story) => (
          <div
            key={story._id}
            className="bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition"
          >
            {/* Imagen igual al Feed */}
            <div className="relative w-full h-80 bg-black overflow-hidden">
              <Image
                src={story.image}
                alt={story.title || "Imagen de la historia"}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>

            <div className="p-4 space-y-2">
              <p className="font-semibold text-white">{story.author}</p>
              <p className="text-sm text-gray-300 mt-1 line-clamp-3">
                {story.content}
              </p>
              <p className="text-xs text-cyan-300 pt-1">{story.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINACIÓN */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-8">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded-lg ${
                page === i + 1
                  ? "bg-cyan-300 text-black"
                  : "bg-white/10 text-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </main>
  );
}