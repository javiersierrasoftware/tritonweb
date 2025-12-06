"use client";

import { useState } from "react";
import { ImageUp, Send } from "lucide-react";

interface CreateStoryFormProps {
  user: {
    name: string;
    email: string;
  };
}

export default function CreateStoryForm({ user }: CreateStoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const formData = new FormData(e.currentTarget);

      // agregar automáticamente usuario ADMIN
      formData.append("adminName", user.name);
      formData.append("adminEmail", user.email);

      const res = await fetch("/api/stories/create", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccessMsg("¡Historia creada con éxito!");
      (e.target as HTMLFormElement).reset();
      setImagePreview(null);

    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#111] border border-white/5 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-4">Crear Nueva Historia</h2>

      {errorMsg && <p className="text-red-400 mb-4">{errorMsg}</p>}
      {successMsg && <p className="text-green-400 mb-4">{successMsg}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="user" required className="w-full bg-black border border-white/10 rounded-lg px-4 py-2" placeholder="Nombre de usuario" />
        <input type="text" name="userTag" required className="w-full bg-black border border-white/10 rounded-lg px-4 py-2" placeholder="@usuario" />
        <input type="text" name="category" required className="w-full bg-black border border-white/10 rounded-lg px-4 py-2" placeholder="Categoría" />
        
        <textarea name="description" required className="w-full bg-black border border-white/10 rounded-lg px-4 py-2" placeholder="Descripción"></textarea>

        <label htmlFor="image-upload" className="cursor-pointer flex items-center gap-2 text-cyan-300">
          <ImageUp size={20} />
          <span>{imagePreview ? "Cambiar imagen" : "Seleccionar imagen"}</span>
        </label>

        <input id="image-upload" name="image" type="file" className="hidden" accept="image/*" required onChange={handleImageChange} />

        {imagePreview && <img src={imagePreview} className="mt-2 rounded-lg max-h-40" />}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-br from-cyan-300 to-orange-300 text-black py-3 rounded-full font-bold"
        >
          {loading ? "Publicando..." : "Publicar Historia"} <Send size={18} />
        </button>
      </form>
    </section>
  );
}