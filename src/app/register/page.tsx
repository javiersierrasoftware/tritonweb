"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const name = String(formData.get("name") || "");
      const email = String(formData.get("email") || "");
      const password = String(formData.get("password") || "");
      const discipline = String(formData.get("discipline") || "");
      const goal = String(formData.get("goal") || "");

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, discipline, goal }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "No se pudo completar el registro.");
      }

      // Registro OK → redirigir a login
      router.push("/login");
    } catch (err: any) {
      setErrorMsg(err.message || "Error inesperado en el registro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white pt-28 pb-20 px-6">
      <div className="max-w-lg mx-auto bg-[#111] border border-white/10 rounded-2xl p-10 space-y-6">
        {/* TÍTULO */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Crear cuenta</h1>
          <p className="text-gray-400 text-sm">
            Únete al Club Deportivo TRITON y sé parte de nuestra comunidad.
          </p>
        </div>

        {/* MENSAJE DE ERROR */}
        {errorMsg && (
          <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/40 rounded-lg px-4 py-2">
            {errorMsg}
          </div>
        )}

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-300">Nombre completo</label>
            <input
              required
              name="name"
              type="text"
              placeholder="Ej: Javier Sierra"
              className="bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyan-300 outline-none"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-300">Correo electrónico</label>
            <input
              required
              name="email"
              type="email"
              placeholder="correo@ejemplo.com"
              className="bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyan-300 outline-none"
            />
          </div>

          {/* Contraseña */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-300">Contraseña</label>
            <input
              required
              name="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              className="bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyan-300 outline-none"
            />
          </div>

          {/* Disciplina */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-300">Disciplina favorita</label>
            <select
              required
              name="discipline"
              className="bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyan-300 outline-none"
            >
              <option value="">Selecciona una opción</option>
              <option value="running">Running</option>
              <option value="ciclismo">Ciclismo</option>
              <option value="natacion">Natación</option>
              <option value="triatlon">Triatlón</option>
            </select>
          </div>

          {/* Objetivo */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-300">Tu objetivo</label>
            <input
              required
              name="goal"
              type="text"
              placeholder="Ej: Mejorar mi tiempo, bajar de peso..."
              className="bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyan-300 outline-none"
            />
          </div>

          {/* BOTÓN */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-br from-cyan-300 to-orange-300 text-black font-bold py-3 rounded-full hover:opacity-90 transition"
          >
            {loading ? "Registrando..." : "Crear cuenta"}
          </button>
        </form>

        {/* Enlace a login */}
        <p className="text-center text-sm text-gray-400 mt-4">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-cyan-300 hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </main>
  );
}