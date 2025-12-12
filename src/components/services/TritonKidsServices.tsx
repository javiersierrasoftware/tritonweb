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
    <section className="text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-orange-300">
            Triton Kids
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            El mejor comienzo en el mundo del deporte para los más pequeños.
          </p>
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