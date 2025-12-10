"use client";

import { useCartStore } from "@/store/cartStore";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react"; // Added useState
import CheckoutForm from "@/components/store/CheckoutForm"; // Added CheckoutForm

export default function CartSidebar() {
  const { isOpen, items, toggleCart, removeItem } = useCartStore();
  const [showCheckoutForm, setShowCheckoutForm] = useState(false); // Added state

  const total = items.reduce((acc, p) => acc + p.price * p.qty, 0);

  if (showCheckoutForm) {
    return <CheckoutForm onClose={() => setShowCheckoutForm(false)} totalAmount={total} />;
  }

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-[#111] border-l border-white/10 p-5 transition-transform duration-300 z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Tu carrito</h3>
        <button onClick={toggleCart}>
          <X size={22} className="text-gray-300" />
        </button>
      </div>

      {/* ITEMS */}
      <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-2">
        {items.length === 0 && (
          <p className="text-gray-400">Tu carrito está vacío.</p>
        )}

        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-3 bg-black/20 p-3 rounded-xl"
          >
            <div className="relative h-16 w-16 rounded-lg overflow-hidden">
              <Image src={item.image || "/placeholder-image.jpg"} alt={item.name} fill />
            </div>

            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-400">
                {item.qty} × ${item.price.toLocaleString()}
              </p>
            </div>

            <button onClick={() => removeItem(item.productId)}>
              <X size={18} className="text-red-400" />
            </button>
          </div>
        ))}
      </div>

      {/* TOTAL */}
      <div className="absolute bottom-5 left-0 w-full px-5">
        <div className="flex justify-between font-semibold mb-3">
          <span>Total:</span>
          <span>${total.toLocaleString()}</span>
        </div>

        <button 
          onClick={() => setShowCheckoutForm(true)} // Added onClick
          className="w-full bg-gradient-to-br from-cyan-300 to-orange-300 text-black font-bold py-2 rounded-xl"
        >
          Procesar pago
        </button>
      </div>
    </div>
  );
}