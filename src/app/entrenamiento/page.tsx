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

      {/* SECCIÓN 1: VIDEOS */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">Videos de Entrenamiento</h2>

        <div className="grid md:grid-cols-2 gap-8">
          <iframe
            className="w-full h-64 rounded-xl border border-white/10"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            allowFullScreen
          ></iframe>

          <iframe
            className="w-full h-64 rounded-xl border border-white/10"
            src="https://www.youtube.com/embed/aqz-KE-bpKQ"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* SECCIÓN 2: SITIOS DE ENTRENAMIENTO */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">Sitios de entrenamiento</h2>

        <ul className="space-y-4 text-gray-300">
          <li>🏃‍♂️ Parque Santander — Running</li>
          <li>🚴‍♂️ Vía Sincelejo – Sampués — Ciclismo</li>
          <li>🏊‍♂️ Piscina Olímpica — Natación</li>
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