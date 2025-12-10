"use client";

import { useCartStore } from "@/store/cartStore";

interface AddToCartButtonProps {
    productId: string;
    name: string;
    price: number;
    image?: string;
}

export default function AddToCartButton({ productId, name, price, image }: AddToCartButtonProps) {
    const addItem = useCartStore((state) => state.addItem);

    const handleAdd = () => {
        addItem({
            productId,
            name,
            price,
            image: image || "/placeholder-image.jpg",
        });
    };

    return (
        <button
            onClick={handleAdd}
            className="bg-gradient-to-br from-cyan-300 to-orange-300 
                       text-black font-bold px-8 py-3 rounded-full mt-6"
        >
            Agregar al carrito
        </button>
    );
}