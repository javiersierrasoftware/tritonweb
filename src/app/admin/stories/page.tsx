"use client";

import { useEffect, useState } from "react";

export default function AdminStoriesPage() {
  const [stories, setStories] = useState([]);

  const loadStories = async () => {
    const res = await fetch("/api/stories");
    const data = await res.json();
    setStories(data);
  };

  useEffect(() => {
    loadStories();
  }, []);

  const deleteStory = async (id: string) => {
    if (!confirm("¿Eliminar historia?")) return;

    await fetch("/api/stories/" + id, { method: "DELETE" });
    loadStories();
  };

  return (
    <main className="pt-24 max-w-5xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Historias TRITON</h1>

      <div className="space-y-6">
        {stories.map((s: any) => (
          <div
            key={s._id}
            className="bg-[#111] p-4 rounded-xl border border-white/10 flex items-center justify-between"
          >
            <div>
              <h3 className="font-bold">{s.userName}</h3>
              <p className="text-gray-400 text-sm">{s.description}</p>
            </div>

            <button
              onClick={() => deleteStory(s._id)}
              className="px-3 py-1 rounded-md bg-red-500/20 text-red-300 hover:bg-red-500/40"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}