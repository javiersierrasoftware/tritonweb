import Image from "next/image";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/store/AddToCartButton";

// Define the shape of product data directly from the MongoDB model
interface ProductData {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  slug: string;
  stock: number;
}

interface ProductPageProps {
  params: {
    slug: string;
  };
}

// Fetch product data on the server
async function getProduct(slug: string): Promise<ProductData | null> {
  await connectDB();
  const product = await Product.findOne({ slug }).lean(); // Use lean() for plain JS objects
  if (!product) {
    return null;
  }
  // Convert _id to string for serialization if needed on client,
  // though mongoose.lean() usually handles this for _id to be an ObjectId itself.
  // For client-side usage, better ensure it's a string.
  return {
    ...product,
    _id: product._id.toString(),
  } as ProductData;
}


export default async function ProductPage({ params }: ProductPageProps) {
  // Fetch product data on the server
  const product = await getProduct(params.slug);

  if (!product) {
    notFound(); // Next.js built-in notFound function
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pt-24 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* IMAGEN PRINCIPAL */}
        <div className="relative h-96 rounded-xl overflow-hidden border border-white/10">
          <Image
            src={product.image || "/placeholder-image.jpg"} // Use product.image
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* INFO DEL PRODUCTO */}
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-400 mt-2">{product.description}</p>

          <p className="text-2xl font-semibold mt-6 text-cyan-300">
            ${product.price.toLocaleString()}
          </p>

          {/* BOTÓN AGREGAR AL CARRITO */}
          <AddToCartButton
            productId={product._id}
            name={product.name}
            price={product.price}
            image={product.image}
          />
        </div>
      </div>
    </div>
  );
}