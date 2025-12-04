"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    id: 1,
    image:
      "https://images.pexels.com/photos/1199590/pexels-photo-1199590.jpeg",
    title: "Corre con nosotros",
    subtitle: "Entrena, mejora y vive la experiencia TRITON Running",
  },
  {
    id: 2,
    image:
      "https://images.pexels.com/photos/260445/pexels-photo-260445.jpeg",
    title: "Nada más lejos",
    subtitle: "Sesiones de natación para todos los niveles",
  },
  {
    id: 3,
    image:
      "https://images.pexels.com/photos/248547/pexels-photo-248547.jpeg",
    title: "Pedalea hacia tus metas",
    subtitle: "Únete al equipo de ciclismo y supera tus límites",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  // Cambio automático cada 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden rounded-2xl">

      {/* SLIDES */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
          />

          {/* OVERLAY OSCURO */}
          <div className="absolute inset-0 bg-black/50"></div>

          {/* TEXTO */}
          <div className="absolute inset-0 flex flex-col justify-center items-start px-10 md:px-20 text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-3 drop-shadow-lg">
              {slide.title}
            </h1>
            <p className="text-lg md:text-2xl mb-6 text-gray-200 drop-shadow-lg">
              {slide.subtitle}
            </p>

            <Link
              href="/join"
              className="px-6 py-3 rounded-full text-black font-semibold bg-gradient-to-br from-cyan-300 to-orange-300 hover:opacity-90 transition text-lg"
            >
              Únete al Club
            </Link>
          </div>
        </div>
      ))}

      {/* DOTS INDICADORES */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`h-3 w-3 rounded-full transition ${
              i === current ? "bg-cyan-300" : "bg-white/40"
            }`}
            onClick={() => setCurrent(i)}
          ></button>
        ))}
      </div>
    </div>
  );
}