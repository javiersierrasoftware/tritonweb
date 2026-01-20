"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const logout = async () => {
    await signOut({ callbackUrl: "/" });
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
          <p>
            <strong>Nombre:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Rol:</strong> {user.role}
          </p>
        </div>

        <button
          onClick={logout}
          className="mt-5 inline-flex items-center gap-2 bg-red-500/90 px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          <LogOut size={18} /> Cerrar sesión
        </button>
      </section>

      {/* NUEVAS FUNCIONALIDADES */}
      <section className="bg-[#111] border border-cyan-500/30 rounded-2xl p-6 text-center">
        <p className="text-xl text-cyan-300 font-semibold">
          Próximamente nuevas funcionalidades
        </p>
      </section>

      {/* SECCIÓN DE ADMIN */}
      {user.role?.toUpperCase() === "ADMIN" && (
        <section className="bg-[#111] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck size={30} className="text-orange-300" />
            <h2 className="text-2xl font-bold">Panel de Administrador</h2>
          </div>

          <p className="text-gray-400 mb-6">
            Desde aquí puedes gestionar el contenido de la web.
          </p>

          <div className="space-y-6">
            {/* HISTORIAS */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Historias</h3>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/stories/create"
                  className="inline-block bg-white/10 text-white font-bold py-3 px-6 rounded-full hover:bg-white/20 transition"
                >
                  Crear Nueva Historia
                </Link>
                <Link
                  href="/stories/manage"
                  className="inline-block bg-white/10 text-white font-bold py-3 px-6 rounded-full hover:bg-white/20 transition"
                >
                  Gestionar Historias
                </Link>
              </div>
            </div>

            {/* EVENTOS */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Eventos</h3>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/events/create"
                  className="inline-block bg-gradient-to-br from-cyan-300 to-orange-300 text-black font-bold py-3 px-6 rounded-full hover:opacity-90 transition"
                >
                  Crear Nuevo Evento
                </Link>
                <Link
                  href="/events/manage"
                  className="inline-block bg-white/10 text-white font-bold py-3 px-6 rounded-full hover:bg-white/20 transition"
                >
                  Gestionar Eventos
                </Link>
              </div>
            </div>

            {/* TIENDA */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Tienda</h3>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/admin/products/create"
                  className="inline-block bg-white/10 text-white font-bold py-3 px-6 rounded-full hover:bg-white/20 transition"
                >
                  Crear Producto
                </Link>
                <Link
                  href="/admin/products/manage"
                  className="inline-block bg-white/10 text-white font-bold py-3 px-6 rounded-full hover:bg-white/20 transition"
                >
                  Gestionar Productos
                </Link>
                <Link
                  href="/admin/sales"
                  className="inline-block bg-white/10 text-white font-bold py-3 px-6 rounded-full hover:bg-white/20 transition"
                >
                  Ventas Realizadas
                </Link>
              </div>
            </div>

            {/* HERO SLIDER */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Hero Slider</h3>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/admin/hero-slider"
                  className="inline-block bg-white/10 text-white font-bold py-3 px-6 rounded-full hover:bg-white/20 transition"
                >
                  Gestionar Hero Slider
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}