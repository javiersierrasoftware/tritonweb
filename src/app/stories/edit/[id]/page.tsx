"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminAuthGuard from "@/components/auth/AdminAuthGuard";

interface FormState {
  title: string;
  author: string;
  content: string;
  image: string;
}

const INITIAL_STATE: FormState = {
  title: "",
  author: "",
  content: "",
  image: "",
};

function EditStoryPageContent() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (!id) return;

    async function fetchStoryData() {
      try {
        setPageLoading(true);
        const res = await fetch(`/api/stories/${id}`);
        const result = await res.json();

        if (!res.ok || !result.ok) {
          throw new Error(result.message || "No se pudo cargar la historia.");
        }

        const story = result.data;
        setForm({
          title: story.title || "",
          author: story.author || "",
          content: story.content || "",
          image: story.image || "",
        });
      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        setPageLoading(false);
      }
    }

    fetchStoryData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setErrorMsg(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("author", form.author);
      formData.append("content", form.content);
      formData.append("currentImage", form.image);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch(`/api/stories/${id}`, {
        method: "PUT",
        credentials: "include", // Important for sending auth cookie
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Error al actualizar la historia");
      }

      setFeedback("¡Historia actualizada exitosamente! Redirigiendo...");

      setTimeout(() => {
        router.push("/stories/manage");
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || "Error inesperado al actualizar la historia");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <div className="text-center py-40">Cargando datos de la historia...</div>;
  }

  return (
    <main className="min-h-screen pb-20">
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Editar Historia</h1>
          <p className="text-gray-400 text-sm">Modifica los detalles de la publicación.</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-sm text-gray-300">Título</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm" required />
          </div>

          <div>
            <label className="text-sm text-gray-300">Autor</label>
            <input type="text" name="author" value={form.author} onChange={handleChange} className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm" required />
          </div>

          <div>
            <label className="text-sm text-gray-300">Contenido</label>
            <textarea name="content" value={form.content} onChange={handleChange} rows={5} className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm resize-none" required />
          </div>

          <div>
            <label className="text-sm text-gray-300">Cambiar imagen</label>
            <input type="file" name="image" accept="image/*" onChange={handleImageChange} className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-300 file:text-black hover:file:bg-cyan-400" />
            {form.image && !imageFile && (
              <div className="mt-2 text-xs text-gray-400">
                <p>Imagen actual:</p>
                <a href={form.image} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline break-all">{form.image}</a>
              </div>
            )}
          </div>

          {feedback && <p className="text-sm text-emerald-400">{feedback}</p>}
          {errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}

          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="inline-flex items-center gap-2 bg-gradient-to-br from-cyan-300 to-orange-300 text-black font-semibold px-6 py-2 rounded-full disabled:opacity-50">
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function EditStoryPage() {
    return (
        <AdminAuthGuard>
            <EditStoryPageContent />
        </AdminAuthGuard>
    )
}