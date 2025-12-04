"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

export default function ProductCard({ id, name, price, images }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = (e) => {
    e.preventDefault();       // ❗ evita que el click abra el detalle
    e.stopPropagation();

    addItem({
      id,
      name,
      price,
      image: images[0],
      qty: 1,
    });
  };

  return (
    <Link
      href={`/tienda/${id}`}
      className="block bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-300/40 transition group"
    >
      {/* Imagen */}
      <div className="relative w-full h-56">
        <Image
          src={images[0]}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition duration-300"
        />
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold">{name}</h3>

        <p className="text-cyan-300 text-lg font-bold">
          ${price.toLocaleString("es-CO")}
        </p>

        {/* Botón agregar al carrito */}
        <button
          onClick={handleAdd}
          className="w-full bg-gradient-to-br from-cyan-300 to-orange-300 text-black font-semibold py-2 rounded-full mt-3 hover:opacity-90 transition"
        >
          Agregar al carrito
        </button>
      </div>
    </Link>
  );
}