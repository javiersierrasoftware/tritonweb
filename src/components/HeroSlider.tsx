"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

interface HeroSlide {
  _id: string;
  image: string;
  title: string;
  subtitle: string;
  buttonLink: string;
  order: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  const { data: slides, error, isLoading } = useSWR<HeroSlide[]>("/api/admin/hero-slider", fetcher, {
    revalidateOnFocus: false,
  });

  // All hooks must be called before any conditional returns.
  useEffect(() => {
    // Guard against running the effect if data is not yet available or valid
    if (!slides || !Array.isArray(slides) || slides.length === 0) {
      return;
    }

    const sortedSlides = [...slides].sort((a, b) => a.order - b.order);

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sortedSlides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides]); // Depend on the slides data itself

  // Conditional rendering can happen after all hooks are called.
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load slides.</div>;
  if (!Array.isArray(slides) || slides.length === 0) return null;

  // Sort slides for rendering
  const sortedSlides = [...slides].sort((a, b) => a.order - b.order);

  return (
    <div className="relative w-full h-[49vh] md:h-[56vh] overflow-hidden rounded-2xl">
      {/* SLIDES */}
      {sortedSlides.map((slide, index) => (
        <div
          key={slide._id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100" : "opacity-0"
            }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
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
              Empieza con un diagnóstico, agendate!
            </Link>
          </div>
        </div>
      ))}
      {/* DOTS INDICADORES */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {sortedSlides.map((_, i) => (
          <button
            key={i}
            className={`h-3 w-3 rounded-full transition ${i === current ? "bg-cyan-300" : "bg-white/40"
              }`}
            onClick={() => setCurrent(i)}
          ></button>
        ))}
      </div>
    </div>
  );
}
