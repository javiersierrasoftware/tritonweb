import { Dumbbell, Gauge, CalendarDays, SunMedium } from "lucide-react";

export default function Dashboard() {
  return (
    <section className="max-w-5xl mx-auto px-4 mt-10 space-y-6">

      {/* Título */}
      <h1 className="text-2xl font-bold">Bienvenido a TRITON</h1>

      {/* GRID PRINCIPAL */}
      <div className="grid gap-4 md:grid-cols-2">

        {/* Próximo entrenamiento */}
        <div className="rounded-2xl p-[2px] bg-gradient-to-br from-cyan-400 via-orange-300 to-pink-500 shadow-lg">
          <div className="bg-black rounded-2xl p-4 flex items-center gap-4">
            <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-white/10">
              <Dumbbell size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-400">Próximo entrenamiento</p>
              <p className="text-sm font-semibold">
                Mañana · 5:00 AM · Fondo 15K
              </p>
            </div>
          </div>
        </div>

        {/* Kilómetros del mes */}
        <div className="bg-[#111] rounded-2xl p-4 flex items-center gap-4 border border-white/5">
          <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-yellow-500/20">
            <Gauge size={24} className="text-yellow-400" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Kilómetros del mes</p>
            <p className="text-xl font-bold">42.7 km</p>
          </div>
        </div>

        {/* Próximo evento */}
        <div className="bg-[#111] rounded-2xl p-4 flex items-center gap-4 border border-white/5">
          <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-orange-500/20">
            <CalendarDays size={24} className="text-orange-400" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Próximo evento</p>
            <p className="text-sm font-semibold">
              Triatlón Santa Marta – 22 Dic
            </p>
          </div>
        </div>

        {/* Clima */}
        <div className="bg-[#111] rounded-2xl p-4 flex items-center gap-4 border border-white/5">
          <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-sky-500/20">
            <SunMedium size={24} className="text-sky-400" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Clima hoy</p>
            <p className="text-sm font-semibold">29°C · Ideal para correr</p>
          </div>
        </div>

      </div>
    </section>
  );
}