"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";

interface Story {
  _id: string;
  user: string;
  userTag: string;
  category: string;
  description: string;
  image: string;
}

interface EditStoryFormProps {
  story: Story;
}

export default function EditStoryForm({ story }: EditStoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const formData = new FormData(e.currentTarget);
      const updatedData = {
        category: formData.get("category"),
        description: formData.get("description"),
      };

      const res = await fetch(`/api/stories/${story._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error inesperado al actualizar la historia.");
      }

      setSuccessMsg("¡Historia actualizada con éxito!");
      // Opcional: redirigir después de un tiempo
      setTimeout(() => router.push("/stories/manage"), 1500);

    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#111] border border-white/5 rounded-2xl p-6">
      {errorMsg && <p className="text-red-400 mb-4">{errorMsg}</p>}
      {successMsg && <p className="text-green-400 mb-4">{successMsg}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Imagen actual */}
        <img src={story.image} alt="Imagen de la historia" className="w-full h-auto rounded-lg object-cover" />
        
        {/* Campos no editables */}
        <input type="text" defaultValue={story.user} readOnly className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-gray-400 cursor-not-allowed" />
        <input type="text" defaultValue={story.userTag} readOnly className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-gray-400 cursor-not-allowed" />

        {/* Campos editables */}
        <input 
          type="text" 
          name="category" 
          defaultValue={story.category} 
          required 
          className="w-full bg-black border border-white/10 rounded-lg px-4 py-2" 
        />
        <textarea 
          name="description" 
          defaultValue={story.description} 
          required 
          rows={5}
          className="w-full bg-black border border-white/10 rounded-lg px-4 py-2"
        ></textarea>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-br from-cyan-300 to-orange-300 text-black font-bold py-3 rounded-full hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar Cambios"}
          <Save size={18} />
        </button>
      </form>
    </section>
  );
}

