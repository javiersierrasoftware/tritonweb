"use client";

import { useState } from "react";

export default function EditStoryModal({ open, onClose, story, onSaved }: any) {
  const [loading, setLoading] = useState(false);

  if (!open || !story) return null;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      category: e.target.category.value,
      description: e.target.description.value,
    };

    const res = await fetch(`/api/stories/${story._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      onSaved();
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-[#111] border border-white/10 rounded-xl p-6 w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold">Editar historia</h2>

        <p className="text-gray-400 text-sm">{story.user}</p>

        <input
          type="text"
          name="category"
          defaultValue={story.category}
          className="w-full bg-black border border-white/10 rounded-lg px-4 py-2"
        />

        <textarea
          name="description"
          defaultValue={story.description}
          className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 h-28"
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/10"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}