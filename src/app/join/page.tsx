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
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Más que deporte</h2>
          <p className="text-gray-300 max-w-3xl">
            En TRITON creemos en el poder del deporte para transformar vidas.
            Nuestro club promueve hábitos saludables, integración social y
            espacios de amistad. Buscamos construir comunidad a través del
            esfuerzo, la constancia y el compañerismo.
          </p>
        </section>

        {/* PLANES DE SUSCRIPCIÓN */}
        <section className="space-y-10">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Planes de Suscripción</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Elige el plan que mejor se adapte a tus objetivos. Ofrecemos opciones flexibles
              con pago mensual o anual (con descuento).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Atletismo",
                img: "/plans/atletismo.png",
                monthly: "$90.000 COP",
                yearly: "$900.000 COP",
                desc: "Acceso a pista, entrenamientos dirigidos y técnica de carrera.",
              },
              {
                name: "Natación",
                img: "/plans/natacion.png",
                monthly: "$110.000 COP",
                yearly: "$1.100.000 COP",
                desc: "Clases de técnica, resistencia y aguas abiertas.",
              },
              {
                name: "Triatlón",
                img: "/plans/triatlon.png",
                monthly: "$160.000 COP",
                yearly: "$1.600.000 COP",
                desc: "Plan integral: Running, Swimming y Cycling.",
              },
              {
                name: "TRITON Kids",
                img: "/plans/kids.png",
                monthly: "$80.000 COP",
                yearly: "$800.000 COP",
                desc: "Formación deportiva divertida para los más pequeños.",
              },
              {
                name: "Vacacionales",
                img: "/plans/vacacionales.png",
                price: "Consultar Tarifas",
                desc: "Temporadas intensivas de deporte y recreación.",
              },
              {
                name: "Plan a la Medida",
                img: "/plans/custom.png",
                price: "Personalizado",
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

                  <div className="space-y-3 pt-4 border-t border-white/10">
                    {plan.price ? (
                      <div className="text-center">
                        <p className="text-2xl font-bold text-cyan-300">{plan.price}</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Mensual</span>
                          <span className="text-xl font-bold text-white">{plan.monthly}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Anual</span>
                          <span className="text-xl font-bold text-orange-300">{plan.yearly}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <Link
                    href="/register"
                    className="mt-6 w-full block text-center py-3 rounded-lg bg-white/5 hover:bg-cyan-300 hover:text-black transition font-semibold"
                  >
                    Elegir Plan
                  </Link>
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