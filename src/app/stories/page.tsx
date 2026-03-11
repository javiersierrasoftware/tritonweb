"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Share2 } from "lucide-react";
import { toast } from "react-toastify";

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

  // Function to handle sharing
  const handleShare = async (story: any) => {
    const shareData = {
      title: `Historia de ${story.author} en TRITON`,
      text: `${story.author}: "${story.content}"`,
      url: window.location.origin + "/stories",
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.info("¡Enlace copiado al portapapeles!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

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
            className="flex flex-col bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition"
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

            <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <p className="font-semibold text-white">{story.author}</p>
                <p className="text-sm text-gray-300 line-clamp-3">
                  {story.content}
                </p>
                <p className="text-xs text-cyan-300">{story.title}</p>
              </div>

              {/* Botón Compartir */}
              <button
                onClick={() => handleShare(story)}
                className="flex items-center justify-center gap-2 w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-semibold transition"
              >
                <Share2 size={16} /> Compartir
              </button>
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
              className={`px-4 py-2 rounded-lg ${page === i + 1
                ? "bg-cyan-300 text-black"
                : "bg-white/10 text-white"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
      {/* SOBRE TRITÓN */}
      <section className="py-20 border-t border-white/10 mt-12 text-center">
        <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-orange-400">
          SOBRE TRITÓN
        </h2>

        <p className="text-gray-300 max-w-3xl mx-auto mb-10 text-lg leading-relaxed">
          Tritón es más que un club deportivo. Somos una comunidad que cree en entrenar bien,
          disfrutar el proceso y construir resultados sostenibles en el tiempo.
        </p>

        <div className="bg-[#111] border border-white/5 rounded-2xl p-8 max-w-4xl mx-auto mb-10">
          <h3 className="text-xl font-semibold text-white mb-6">Nuestro enfoque une:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center gap-3 group">
              <div className="p-3 bg-white/5 rounded-full group-hover:bg-cyan-500/10 transition-colors">
                <span className="text-2xl">🔬</span>
              </div>
              <span className="text-gray-200 font-medium">Ciencia</span>
            </div>
            <div className="flex flex-col items-center gap-3 group">
              <div className="p-3 bg-white/5 rounded-full group-hover:bg-cyan-500/10 transition-colors">
                <span className="text-2xl">💻</span>
              </div>
              <span className="text-gray-200 font-medium">Tecnología</span>
            </div>
            <div className="flex flex-col items-center gap-3 group">
              <div className="p-3 bg-white/5 rounded-full group-hover:bg-cyan-500/10 transition-colors">
                <span className="text-2xl">🏅</span>
              </div>
              <span className="text-gray-200 font-medium">Experiencia</span>
            </div>
            <div className="flex flex-col items-center gap-3 group">
              <div className="p-3 bg-white/5 rounded-full group-hover:bg-cyan-500/10 transition-colors">
                <span className="text-2xl">🤝</span>
              </div>
              <span className="text-gray-200 font-medium text-center">Acompañamiento humano</span>
            </div>
          </div>
        </div>

        <p className="text-2xl font-bold text-white">
          Aquí no entrenas solo. <span className="text-cyan-300">Entrenas con sentido.</span>
        </p>
      </section>

    </main>
  );
}