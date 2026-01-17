"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Added useSearchParams
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/perfil"; // Get callbackUrl or default

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = String(formData.get("email") || "");
      const password = String(formData.get("password") || "");

      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (res?.error) {
        throw new Error("Credenciales inválidas. Verifica tu correo y contraseña.");
      }

      if (res?.ok) {
        // 🔥 Notificar al Navbar que debe actualizarse (NextAuth handles this, but keeping event dispatch just in case legacy listeners need it temporarily)
        window.dispatchEvent(new Event("storage"));

        router.push(callbackUrl);
        router.refresh(); // Ensure session is updated
      }

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Error inesperado al iniciar sesión.");
      toast.error(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white pt-28 pb-20 px-6">
      <div className="max-w-lg mx-auto bg-[#111] border border-white/10 rounded-2xl p-10 space-y-6">

        {/* TÍTULO */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Inicia sesión</h1>
          <p className="text-gray-400 text-sm">
            Accede a tu cuenta y sigue entrenando con la comunidad TRITON.
          </p>
        </div>

        {/* ERROR */}
        {errorMsg && (
          <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/40 rounded-lg px-4 py-2">
            {errorMsg}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-300">Correo</label>
            <input
              required
              name="email"
              type="email"
              placeholder="correo@ejemplo.com"
              className="bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyan-300 outline-none"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-300">Contraseña</label>
            <input
              required
              name="password"
              type="password"
              placeholder="••••••••"
              className="bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyan-300 outline-none"
            />
          </div>

          {/* BOTÓN */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-br from-cyan-300 to-orange-300 text-black font-bold py-3 rounded-full hover:opacity-90 transition"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        {/* ENLACE A REGISTRO */}
        <p className="text-center text-sm text-gray-400 mt-4">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-cyan-300 hover:underline">
            Crear una cuenta
          </Link>
        </p>
      </div>
    </main>
  );
}