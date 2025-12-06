"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Trash2,
  Pencil,
  Search,
  CheckSquare,
  Square,
  Star,
  StarOff,
  Plus,
} from "lucide-react";
import Link from "next/link";

export default function ManageStories() {
  const [stories, setStories] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const itemsPerPage = 6;

  // 👉 Cargar historias
  useEffect(() => {
    fetch("/api/stories")
      .then((res) => res.json())
      .then((data) => setStories(data.reverse()))
      .catch(console.error);
  }, []);

  // 👉 Filtrar historias
  const filteredStories = stories.filter(
    (s) =>
      s.user.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  // 👉 Paginación
  const totalPages = Math.ceil(filteredStories.length / itemsPerPage);
  const paginated = filteredStories.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // 👉 Selección múltiple
  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // 👉 Marcar / desmarcar destacada
  const toggleFeatured = async (story: any) => {
    await fetch(`/api/stories/${story._id}/featured`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !story.featured }),
    });

    setStories((prev) =>
      prev.map((s) =>
        s._id === story._id ? { ...s, featured: !s.featured } : s
      )
    );
  };

  // 👉 Eliminar múltiples
  const deleteSelected = async () => {
    if (selected.length === 0) return;

    const ok = confirm(
      `¿Eliminar ${selected.length} historia(s)? Esta acción no se puede deshacer.`
    );
    if (!ok) return;

    await Promise.all(
      selected.map((id) => fetch(`/api/stories/${id}`, { method: "DELETE" }))
    );

    setStories((prev) => prev.filter((s) => !selected.includes(s._id)));
    setSelected([]);
  };

  // 👉 Eliminar una
  const deleteOne = async (id: string) => {
    await fetch(`/api/stories/${id}`, { method: "DELETE" });
    setStories((prev) => prev.filter((s) => s._id !== id));
    setConfirmDeleteId(null);
  };

  return (
    <div className="space-y-6">
      {/* ENCABEZADO */}
      <div className="flex justify-between items-center">
        {/* Buscador */}
        <div className="flex items-center gap-2 bg-black border border-white/10 px-3 py-2 rounded-lg">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Buscar historias..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm text-white"
          />
        </div>

        {/* Botón Crear */}
        <Link
          href="/stories/create"
          className="flex items-center gap-2 bg-gradient-to-br from-cyan-300 to-orange-300 text-black px-4 py-2 rounded-full font-semibold text-sm shadow-md"
        >
          <Plus size={18} /> Crear historia
        </Link>
      </div>

      {/* Botón eliminar masivo */}
      {selected.length > 0 && (
        <button
          onClick={deleteSelected}
          className="bg-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-500"
        >
          Eliminar seleccionadas ({selected.length})
        </button>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {paginated.map((post) => (
          <div
            key={post._id}
            className="relative bg-[#111] border border-white/5 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition"
          >
            {/* Checkbox */}
            <button
              className="absolute top-2 left-2 z-10"
              onClick={() => toggleSelect(post._id)}
            >
              {selected.includes(post._id) ? (
                <CheckSquare size={22} className="text-cyan-300" />
              ) : (
                <Square size={22} className="text-gray-400" />
              )}
            </button>

            {/* Acciones */}
            <div className="absolute top-2 right-2 flex gap-2 z-10">
              {/* Editar */}
              <Link href={`/stories/edit/${post._id}`}>
                <Pencil size={18} className="text-white hover:text-cyan-300" />
              </Link>

              {/* Eliminar */}
              <button onClick={() => setConfirmDeleteId(post._id)}>
                <Trash2 size={18} className="text-red-400 hover:text-red-300" />
              </button>
            </div>

            {/* Destacar */}
            <button
              onClick={() => toggleFeatured(post)}
              className="absolute bottom-2 right-2 z-10 px-3 py-1 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 backdrop-blur-md"
            >
              {post.featured ? (
                <span className="flex items-center gap-1 text-yellow-400">
                  <Star size={14} /> Destacada
                </span>
              ) : (
                <span className="flex items-center gap-1 text-gray-300">
                  <StarOff size={14} /> Destacar
                </span>
              )}
            </button>

            {/* Imagen (igual que Feed) */}
            <div className="relative w-full h-80 bg-black rounded-t-xl overflow-hidden">
              <Image
                src={post.image}
                alt={post.description}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>

            {/* Texto */}
            <div className="p-4">
              <p className="font-semibold text-white">{post.user}</p>
              <p className="text-xs text-gray-400">@{post.userTag}</p>
              <p className="text-sm mt-2 text-gray-300 line-clamp-2">
                {post.description}
              </p>
              <span className="text-xs text-cyan-300">{post.category}</span>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINACIÓN */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-6">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded-lg ${
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

      {/* MODAL ELIMINAR */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-[#111] p-6 rounded-xl border border-white/10 max-w-sm">
            <h3 className="text-lg font-bold mb-3">Eliminar historia</h3>
            <p className="text-gray-300 mb-6">
              ¿Estás seguro de eliminar esta historia? Esta acción no se puede deshacer.
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