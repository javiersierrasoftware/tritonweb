"use client";

import { Sun, Waves, Footprints } from 'lucide-react';
import Link from 'next/link';

const kidsServices = [
  {
    icon: <Sun size={40} className="text-cyan-400" />,
    title: "Vacaciones Recreativas",
    description: "Programas llenos de deporte, juegos y aprendizaje durante las vacaciones escolares. ¡Diversión garantizada en un entorno seguro y saludable!",
    link: "/join",
  },
  {
    icon: <Waves size={40} className="text-cyan-400" />,
    title: "Natación para Niños",
    description: "Clases de natación para todos los niveles, desde iniciación hasta perfeccionamiento. Fomentamos la seguridad y el amor por el agua.",
    link: "/join",
  },
  {
    icon: <Footprints size={40} className="text-orange-300" />,
    title: "Running para Niños",
    description: "Iniciación al atletismo de una forma lúdica y divertida. Desarrollamos sus capacidades motoras y el espíritu deportivo.",
    link: "/join",
  },
];

const TritonKidsServices = () => {
  return (
    <section className="bg-black text-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-cyan-400 uppercase mb-6">
            TRITON KIDS
          </h2>

          <h3 className="text-2xl md:text-3xl font-semibold text-white mb-6">
            Formamos niños activos, seguros y felices
          </h3>

          <p className="max-w-3xl mx-auto text-lg text-gray-400 leading-relaxed mb-8">
            Programa deportivo para niños de 3 a 14 años, enfocado en el desarrollo motor,
            la confianza y el amor por el movimiento.
          </p>

          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm md:text-base text-gray-300">
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:border-orange-400/50 transition-colors">
              <span className="text-orange-400">✨</span> Atletismo y actividades lúdicas
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:border-orange-400/50 transition-colors">
              <span className="text-orange-400">🤸</span> Trabajo de coordinación
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:border-orange-400/50 transition-colors">
              <span className="text-orange-400">🛡️</span> Ambiente seguro y formativo
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:border-orange-400/50 transition-colors">
              <span className="text-orange-400">🤝</span> Sin presión competitiva
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {kidsServices.map((service, index) => (
            <Link href={service.link} key={index} className="block group">
              <div
                className="bg-[#111] border border-white/5 rounded-2xl shadow-md group-hover:border-cyan-400/50 p-8 flex flex-col items-center text-center transition-all duration-300 transform group-hover:-translate-y-1 h-full"
              >
                <div className="mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{service.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TritonKidsServices;