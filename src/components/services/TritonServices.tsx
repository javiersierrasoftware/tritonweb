"use client";

import { Dumbbell, HeartPulse, Trophy, Carrot } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    icon: <Dumbbell size={40} className="text-cyan-400" />,
    title: "Entrenamiento Personalizado",
    description: "Planes de entrenamiento adaptados a tus objetivos, nivel y disponibilidad. Maximiza tu rendimiento con la guía de nuestros expertos.",
    link: "/join",
  },
  {
    icon: <HeartPulse size={40} className="text-cyan-400" />,
    title: "Fisioterapia Deportiva",
    description: "Recuperación de lesiones, prevención y masajes de descarga. Vuelve a tu mejor nivel con nuestros fisioterapeutas especializados.",
    link: "/join",
  },
  {
    icon: <Trophy size={40} className="text-cyan-400" />,
    title: "Planificación de Competencias",
    description: "Te ayudamos a estructurar tu calendario de competencias, picos de forma y estrategias para alcanzar tus metas deportivas.",
    link: "/join",
  },
  {
    icon: <Carrot size={40} className="text-orange-300" />,
    title: "Nutricionista",
    description: "Asesoría nutricional para deportistas. Optimiza tu alimentación para mejorar tu energía, recuperación y composición corporal.",
    link: "/join",
  },
];

const TritonServices = () => {
  return (
    <section className="bg-black text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-orange-300">
            Servicios Triton
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Todo lo que necesitas para llevar tu rendimiento al siguiente nivel.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
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

export default TritonServices;