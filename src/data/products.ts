import Image from "next/image";
import { products } from "@/data/products";
import { useCartStore } from "@/store/cartStore";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const addItem = useCartStore((state) => state.addItem);

  const product = products.find((p) => p.id === params.slug);

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 pt-24">
        <h1 className="text-2xl font-bold">Producto no encontrado</h1>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pt-24 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        <div className="relative h-96 rounded-xl overflow-hidden border border-white/10">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-400 mt-2">{product.description}</p>

          <p className="text-2xl font-semibold mt-6 text-cyan-300">
            ${product.price.toLocaleString()}
          </p>

          <button
            onClick={() =>
              addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                img: product.images[0],
              })
            }
            className="bg-gradient-to-br from-cyan-300 to-orange-300 
                       text-black font-bold px-8 py-3 rounded-full mt-6"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}