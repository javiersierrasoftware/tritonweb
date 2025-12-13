import Link from "next/link";

export default function JoinPage() {
  return (
    <main className="min-h-screen bg-black text-white pt-28 pb-20 px-6">
      {/* CONTENEDOR */}
      <div className="max-w-5xl mx-auto space-y-20">
        {/* INTRO */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold">
            Únete al Club <span className="text-cyan-300">TRITON</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Un lugar donde entrenar, mejorar y conectar con una comunidad
            apasionada por el running, la natación y el ciclismo.
          </p>
        </section>

        {/* BENEFICIOS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              title: "Entrenamientos Guiados",
              desc: "Sesiones presenciales y planes estructurados para todos los niveles.",
            },
            {
              title: "Comunidad Activa",
              desc: "Corre, nada y pedalea junto a personas que te motivan y comparten tus metas.",
            },
            {
              title: "Eventos Exclusivos",
              desc: "Accede a carreras, fondos y actividades especiales del club.",
            },
          ].map((benefit, i) => (
            <div
              key={i}
              className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:border-cyan-300/30 transition"
            >
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-gray-400">{benefit.desc}</p>
            </div>
          ))}
        </section>

        {/* IMPACTO SOCIAL */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Más que deporte</h2>
          <p className="text-gray-300 max-w-3xl">
            En TRITON creemos en el poder del deporte para transformar vidas.
            Nuestro club promueve hábitos saludables, integración social y
            espacios de amistad. Buscamos construir comunidad a través del
            esfuerzo, la constancia y el compañerismo.
          </p>
        </section>

        {/* LUGARES DE ENTRENAMIENTO */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Sitios de Entrenamiento</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                lugar:
                  "Ciclo vía Sincelejo- Corozal y Estadio Arturo Cumplido Sierra",
                desc: "Entrenamientos de running",
              },
              { lugar: "Piscinas y playas de Tolú y Coveñas", desc: "Sesiones de natación" },
              { lugar: "Vías intermunicipales de Sincelejo", desc: "Fondos de ciclismo" },
            ].map((s, idx) => (
              <div key={idx} className="bg-[#111] border border-white/5 rounded-2xl p-6">
                <h3 className="text-xl font-bold">{s.lugar}</h3>
                <p className="text-gray-400 text-sm mt-2">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="text-center mt-10">
          <Link
            href="/register"
            className="
              w-full max-w-md mx-auto
              inline-flex items-center justify-center
              px-8 py-4
              bg-gradient-to-br from-cyan-300 to-orange-300
              text-black font-bold
              rounded-full
              text-base sm:text-lg
              leading-tight text-center
              whitespace-normal
              hover:opacity-90 transition
            "
          >
            Crear mi cuenta y unirme al club
          </Link>

          <p className="text-gray-400 text-sm mt-3 px-4">
            Forma parte de la comunidad deportiva más activa de Sincelejo.
          </p>
        </section>
      </div>
    </main>
  );
}