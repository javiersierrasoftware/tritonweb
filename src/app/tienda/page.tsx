import { products } from "@/data/products";
import ProductCard from "@/components/store/ProductCard";

export default function StorePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-28 pb-20">
      <h1 className="text-3xl font-bold mb-6">Tienda TRITON</h1>

      {/* GRID DE PRODUCTOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </div>
  );
}