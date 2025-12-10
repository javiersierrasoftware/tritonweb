"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth"; // Assuming you have an auth hook
import { useCartStore } from "@/store/cartStore";

interface CheckoutFormProps {
  onClose: () => void;
  totalAmount: number;
}

export default function CheckoutForm({ onClose, totalAmount }: CheckoutFormProps) {
  const { items } = useCartStore(); // Get cart items
  const { user, token } = useAuth(); // Assuming useAuth provides user and token

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    cedula: "",
    address: "",
    phoneNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Prefill cedula, address, phoneNumber if user is logged in and has profile data
  // This would require fetching user profile from DB or having it in the user object
  // For now, we'll assume it's not directly in 'user' from useAuth unless specified.
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        // Potentially fetch more user details here if needed and available from an API
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (items.length === 0) {
        throw new Error("El carrito está vacío.");
      }

      const orderDetails = {
        ...formData,
        cartItems: items.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          qty: item.qty,
          image: item.image,
        })),
        totalAmount,
      };

      const res = await fetch("/api/store/checkout/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Send token if available, but Wompi payment initiation often doesn't need
          // client-side token directly if the backend handles auth via cookies.
          // For now, assuming backend will use cookies if user is logged in.
        },
        body: JSON.stringify(orderDetails),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al procesar el pago.");
      }

      if (data.redirectUrl) {
        router.push(data.redirectUrl); // Redirect to Wompi checkout
      } else {
        throw new Error("No se recibió URL de redirección para el pago.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#111] border border-white/10 rounded-xl p-6 max-w-lg w-full space-y-4">
        <h2 className="text-2xl font-bold mb-4">Datos del Comprador</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Nombre Completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="cedula" className="block text-sm font-medium text-gray-300">
              Cédula
            </label>
            <input
              type="text"
              id="cedula"
              name="cedula"
              value={formData.cedula}
              onChange={handleChange}
              required
              className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-300">
              Dirección de envío
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300">
              Teléfono móvil
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            />
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <span className="text-xl font-bold">Total: ${totalAmount.toLocaleString()}</span>
            <div className="flex gap-3">
                <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                >
                Cancelar
                </button>
                <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 rounded-lg bg-gradient-to-br from-cyan-300 to-orange-300 text-black font-bold hover:opacity-90 transition"
                >
                {isLoading ? "Procesando..." : "Pagar con Wompi"}
                </button>
            </div>
          </div>

          {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}
