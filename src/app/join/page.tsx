import Link from "next/link";
import Image from "next/image";

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
        <section className="space-y-6 text-center">
          <h2 className="text-3xl font-bold">Más que deporte</h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            En TRITON creemos en el poder del deporte para transformar vidas.
            Nuestro club promueve hábitos saludables, integración social y
            espacios de amistad. Buscamos construir comunidad a través del
            esfuerzo, la constancia y el compañerismo.
          </p>
        </section>

        {/* PLANES DE SUSCRIPCIÓN */}
        <section className="space-y-10">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-8">
              💳 Planes mensuales, semestrales y anuales
            </h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-10 text-gray-300 text-lg">
              <span className="flex items-center gap-2">
                <span className="text-cyan-400">✔</span> Pago mensual
              </span>
              <span className="flex items-center gap-2">
                <span className="text-cyan-400">✔</span> 10% de descuento pagando 6 meses
              </span>
              <span className="flex items-center gap-2">
                <span className="text-cyan-400">✔</span> 20% de descuento pagando 12 meses
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Atletismo",
                img: "/plans/atletismo.png",
                desc: "Entrenamientos dirigidos y técnica de carrera.",
              },
              {
                name: "Natación",
                img: "/plans/natacion.png",
                desc: "Clases de técnica, resistencia y aguas abiertas.",
              },
              {
                name: "Triatlón",
                img: "/plans/triatlon.png",
                desc: "Plan integral: Running, Swimming y Cycling.",
              },
              {
                name: "TRITON Kids",
                img: "/plans/kids.png",
                desc: "Formación deportiva divertida para los más pequeños.",
              },
              {
                name: "Vacacionales",
                img: "/plans/vacacionales.png",
                desc: "Temporadas intensivas de deporte y recreación.",
              },
              {
                name: "Plan a la Medida",
                img: "/plans/custom.png",
                desc: "Entrenamiento 1:1 diseñado específicamente para ti.",
              },
            ].map((plan, i) => (
              <div
                key={i}
                className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-300/50 transition duration-300 group flex flex-col"
              >
                {/* Imagen */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={plan.img}
                    alt={plan.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent opacity-80"></div>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-gray-400 text-sm mb-6 flex-grow">{plan.desc}</p>

                  <a
                    href="https://wa.me/573214457170?text=Hola,%20me%20gustaría%20agendar%20un%20diagnóstico"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto w-full block text-center py-3 rounded-lg bg-white/5 hover:bg-cyan-300 hover:text-black transition font-semibold"
                  >
                    Agenda tu diagnóstico
                  </a>
                </div>
              </div>
            ))}
          </div>
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