export default function EntrenamientoPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-28 pb-20">

      <h1 className="text-4xl font-bold mb-6">Entrenamientos TRITON</h1>

      <p className="text-gray-300 leading-relaxed max-w-3xl mb-10">
        En TRITON creemos que el deporte es más que ejercicio: es salud, disciplina,
        comunidad y amistad. Nuestros entrenamientos están diseñados para todos los niveles,
        desde principiantes hasta atletas avanzados, con el objetivo de mejorar el rendimiento
        físico mientras fortalecemos el sentido de pertenencia, apoyo y crecimiento entre los
        miembros del club.
      </p>

      {/* SECCIÓN: METODOLOGÍA */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-orange-400">
          En Tritón no improvisamos
        </h2>
        <p className="text-gray-300 mb-10 max-w-2xl text-lg">
          Cada proceso sigue una estructura clara para garantizar tu evolución:
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {[
            "Diagnóstico inicial para definir el punto de partida",
            "Definición de objetivos reales (salud, bienestar o rendimiento)",
            "Planificación personalizada en TrainingPeaks",
            "Retroalimentación semanal basada en datos reales",
            "Evaluaciones periódicas para medir progreso",
            "Ajustes continuos según tu evolución física y mental"
          ].map((item, index) => (
            <div key={index} className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-cyan-400/30 transition-all hover:bg-white/10 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-cyan-500/10 transition-all"></div>
              <span className="text-5xl font-bold text-white/5 mb-4 block group-hover:text-cyan-400/20 transition-colors">
                0{index + 1}
              </span>
              <p className="text-gray-200 font-medium leading-relaxed relative z-10">{item}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-cyan-900/20 to-orange-900/20 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
          <p className="text-gray-300 leading-relaxed text-lg">
            <span className="text-cyan-400 font-bold mr-2">✓</span>
            Usamos metodología con base científica <span className="text-orange-300 font-bold mx-1">(80/20)</span>, análisis de carga, fatiga y estado de forma, y cuando es necesario, <span className="text-cyan-400 font-bold mx-1">análisis de lactato</span>, algo único en la región.
          </p>
        </div>
      </section>

      {/* SECCIÓN 1: VIDEOS */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">Videos de Entrenamiento</h2>

        <div className="grid md:grid-cols-2 gap-8">
          <iframe
            className="w-full h-64 rounded-xl border border-white/10"
            src="https://www.youtube.com/embed/sPgpoHl_Icg?si=kZ8Z4Z4Z4Z4Z4Z4Z" // Added ?si parameter for good measure if needed, or just plain ID
            title="Training Video 1"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>

          <iframe
            className="w-full h-64 rounded-xl border border-white/10"
            src="https://www.youtube.com/embed/vVCrlgwrxl4"
            title="Training Video 2"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* SECCIÓN: QUÉ INCLUYE */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-orange-400">
          ¿QUÉ INCLUYE EL PLAN DE ENTRENAMIENTO?
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            "Diagnóstico inicial completo",
            "Medidas antropométricas",
            "Entrenamiento personalizado en TrainingPeaks",
            "Retroalimentación semanal detallada",
            "Definición y ajuste de zonas de entrenamiento",
            "Tests periódicos de control",
            "Sesiones de fortalecimiento y movilidad",
            "Entrenamiento mental",
            "Comunicación ilimitada",
            "Planeación deportiva según el ciclo menstrual (mujeres)"
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3 bg-white/5 px-5 py-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
              <span className="text-cyan-400 flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </span>
              <span className="text-gray-200 font-medium">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN 2: SITIOS DE ENTRENAMIENTO */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">Sitios de entrenamiento</h2>

        <ul className="space-y-4 text-gray-300">
          <li>🏃‍♂️ Ciclo vía Sincelejo- Corozal — Running</li>
          <li>🏃‍♂️ Estadio Arturo Cumplido Sierra — Running</li>
          <li>🚴‍♂️ Vías de Sincelejo — Ciclismo</li>
          <li>🏊‍♂️ Piscinas — Natación</li>
        </ul>
      </section>

      {/* SECCIÓN 3: CALENDARIO */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">Fechas tentativas</h2>

        <ul className="text-gray-300 space-y-3">
          <li>Lunes — Fondo suave</li>
          <li>Miércoles — Intervalos / Técnica</li>
          <li>Sábado — Tirada larga o salida de ciclismo</li>
        </ul>
      </section>

      {/* BOTÓN UNIRSE */}
      <div className="mt-10">
        <a
          href="/join"
          className="bg-gradient-to-br from-cyan-300 to-orange-300 text-black font-bold px-8 py-3 rounded-full text-lg"
        >
          Unirme al Club
        </a>
      </div>
    </div>
  );
}