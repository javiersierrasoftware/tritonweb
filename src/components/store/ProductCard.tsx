"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

interface ProductCardProps {
  _id: string; // Changed id to _id to match mongoose model
  name: string;
  price: number;
  image?: string; // Expect a single optional image string
}

export default function ProductCard({ _id, name, price, image }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: _id, // Use _id from props as productId
      name,
      price,
      image: image || "/placeholder-image.jpg", // Use single image with fallback
    });
  };

  return (
    <Link
      href={`/tienda/${_id}`} // Use _id for the link
      className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:scale-[1.01] transition block"
    >
      <div className="relative w-full h-56">
        <Image
          src={image || "/placeholder-image.jpg"} // Use single image with fallback
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