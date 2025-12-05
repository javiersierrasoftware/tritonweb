"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User, CalendarDays, ShoppingBag } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  // Leer usuario guardado en localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(stored));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!user) return null;

  return (
    <main className="max-w-5xl mx-auto px-4 pt-24 pb-16 space-y-10">
      {/* TÍTULO */}
      <div className="flex items-center gap-3">
        <User size={30} className="text-cyan-300" />
        <h1 className="text-3xl font-bold">Mi Perfil</h1>
      </div>

      {/* INFO DEL USUARIO */}
      <section className="bg-[#111] border border-white/5 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-3">Información Personal</h2>

        <div className="space-y-2 text-gray-300">
          <p><strong>Nombre:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>

        <button
          onClick={logout}
          className="mt-5 inline-flex items-center gap-2 bg-red-500/90 px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          <LogOut size={18} /> Cerrar sesión
        </button>
      </section>

      {/* EVENTOS INSCRITOS */}
      <section className="bg-[#111] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <CalendarDays size={22} className="text-cyan-300" />
          <h2 className="text-xl font-semibold">Mis Eventos</h2>
        </div>

        <p className="text-gray-400 text-sm">
          Próximamente podrás ver aquí tus inscripciones.
        </p>
      </section>

      {/* COMPRAS */}
      <section className="bg-[#111] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <ShoppingBag size={22} className="text-cyan-300" />
          <h2 className="text-xl font-semibold">Mis Compras</h2>
        </div>

        <p className="text-gray-400 text-sm">
          Próximamente podrás ver aquí tu historial de compras.
        </p>
      </section>
    </main>
  );
}