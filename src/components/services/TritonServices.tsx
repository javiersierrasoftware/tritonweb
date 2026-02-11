"use client";

import { Footprints, Bike, Waves } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    icon: <Footprints size={40} className="text-cyan-400" />,
    title: "ATLETISMO",
    subtitle: "Desde tus primeros kilómetros hasta tu mejor versión",
    description: "Entrenamiento de atletismo para personas de todas las edades, sin importar si estás empezando desde cero o si ya tienes experiencia.",
    features: [
      "Plan personalizado según tu nivel y objetivos",
      "Definición de zonas por ritmo y frecuencia cardiaca",
      "Seguimiento semanal real",
      "Fortalecimiento y movilidad para prevenir lesiones"
    ],
    linkText: "👉 Ver programa de Atletismo",
    link: "/join",
  },
  {
    icon: <Bike size={40} className="text-cyan-400" />,
    title: "CICLISMO",
    subtitle: "Pedalea con propósito, no solo con ganas",
    description: "Programa de ciclismo enfocado en mejorar resistencia, eficiencia y control del esfuerzo, tanto para salud como para rendimiento.",
    features: [
      "Test de zonas (potencia y/o FC)",
      "Planificación estructurada en TrainingPeaks",
      "Análisis de sesiones indoor y outdoor",
      "Ajustes continuos según tu evolución"
    ],
    linkText: "👉 Ver programa de Ciclismo",
    link: "/join",
  },
  {
    icon: <Waves size={40} className="text-cyan-400" />,
    title: "NATACIÓN",
    subtitle: "Aprende, mejora o perfecciona tu técnica",
    description: "Entrenamiento de natación para todas las edades, adaptado a tu nivel, objetivo y contexto.",
    features: [
      "Evaluación técnica inicial",
      "Corrección de errores clave",
      "Planificación progresiva",
      "Integración con atletismo y ciclismo si haces triatlón"
    ],
    linkText: "👉 Ver programa de Natación",
    link: "/join",
  },
];

const TritonServices = () => {
  return (
    <section className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white uppercase">
            NUESTROS PROGRAMAS
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link href={service.link} key={index} className="block group h-full">
              <div
                className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 flex flex-col h-full transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] group-hover:-translate-y-2 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-cyan-500/10 transition-all duration-500"></div>

                <div className="mb-6 relative z-10">
                  <div className="p-3 bg-white/5 rounded-2xl w-fit group-hover:bg-cyan-500/10 transition-colors duration-300">
                    {service.icon}
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-2 text-white uppercase tracking-wide group-hover:text-cyan-400 transition-colors">
                  {service.title}
                </h3>

                <p className="text-cyan-400/90 font-medium mb-4 text-sm uppercase tracking-wide">
                  {service.subtitle}
                </p>

                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>

                <div className="space-y-3 mb-8 flex-grow">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start text-sm text-gray-300 group/item">
                      <span className="text-cyan-500/70 mr-2 mt-0.5 flex-shrink-0 group-hover:text-cyan-400 transition-colors">•</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-4 border-t border-white/5 w-full">
                  <span className="text-cyan-400 font-bold text-sm tracking-wide group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                    {service.linkText.replace('👉 ', '')}
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TritonServices;