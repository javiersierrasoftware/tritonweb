"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/store/ProductCard";

export default function StorePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Error cargando productos:", error);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 pt-28 pb-20">
      <h1 className="text-3xl font-bold mb-6">Tienda TRITON</h1>

      {/* GRID DE PRODUCTOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p: any) => (
          <ProductCard key={p._id} {...p} />
        ))}
      </div>
    </div>
  );
}
