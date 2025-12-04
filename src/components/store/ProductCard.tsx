"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  images: string[];
}

export default function ProductCard({ id, name, price, images }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ 
  id: p.id,
  name: p.name,
  price: p.price,
  img: p.images[0],
});
  };

  return (
    <Link
      href={`/tienda/${id}`}
      className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:scale-[1.01] transition block"
    >
      <div className="relative w-full h-56">
        <Image
          src={images[0]}
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4 flex flex-col">
        <h3 className="font-semibold">{name}</h3>
        <p className="text-sm text-gray-400">${price.toLocaleString()}</p>

        <button
          onClick={handleAdd}
          className="mt-3 bg-gradient-to-br from-cyan-300 to-orange-300 
                     text-black font-semibold rounded-full py-1.5"
        >
          Agregar al carrito
        </button>
      </div>
    </Link>
  );
}