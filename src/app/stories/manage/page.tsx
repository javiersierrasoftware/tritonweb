"use client";

import { useState, useEffect } from "react";
import ManageStories from "@/components/ManageStories";

export default function ManageStoriesPage() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (!stored) return;

      const user = JSON.parse(stored);
      setIsAdmin(user.role === "ADMIN");
    } catch (err) {
      console.error("Error leyendo usuario:", err);
    }
  }, []);

  if (!isAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        <p className="text-gray-400 text-lg">
          Acceso denegado. Solo administradores pueden ver este panel.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 pt-28 pb-16 text-white max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Administrar Historias</h1>

      {/* Panel de administración */}
      <ManageStories />
    </main>
  );
}