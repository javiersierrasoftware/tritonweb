"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { products } from "@/data/products";
import { useCartStore } from "@/store/cartStore";

export default function ProductDetail() {
  const { slug } = useParams();
  const product = products.find((p) => p.id === slug);
  const addItem = useCartStore((state) => state.addItem);

  if (!product) {
    return (
      <div className="max-w-5xl mx-auto px-4 pt-28 text-center">
        <h2 className="text-2xl font-bold text-red-400">Producto no encontrado</h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pt-28 pb-20">
      <div className="grid md:grid-cols-2 gap-10">

        {/* IMAGEN PRINCIPAL */}
        <div className="relative w-full h-96 rounded-2xl overflow-hidden border border-white/10">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* INFO */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl text-cyan-300 font-semibold mb-4">
            ${product.price.toLocaleString("es-CO")}
          </p>

          <p className="text-gray-300 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* TALLAS */}
          {product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Tallas disponibles</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <span
                    key={size}
                    className="px-3 py-1 rounded-full border border-white/20 hover:bg-white/10 cursor-pointer"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* BOTÓN AGREGAR AL CARRITO */}
          <button
            onClick={() =>
              addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0],
                qty: 1,
              })
            }
            className="bg-gradient-to-br from-cyan-300 to-orange-300 text-black font-bold px-6 py-3 rounded-full text-lg mt-4"
          >
            Agregar al carrito
          </button>

          {/* ESPECIFICACIONES */}
          <div className="mt-10">
            <h3 className="font-semibold text-xl mb-3">Especificaciones</h3>
            <ul className="list-disc ml-6 text-gray-300 space-y-1">
              {product.specs.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}