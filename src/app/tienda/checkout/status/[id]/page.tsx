"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

interface OrderStatusPageProps {
  params: {
    id: string;
  };
}

export default function OrderStatusPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/store/orders/${id}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Error al cargar el estado de la orden.");
        }
        setOrder(data);
        if (data.status === "COMPLETED" || data.status === "PAID") {
          clearCart(); // Clear cart on successful payment
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      fetchOrder();
    }
  }, [id, clearCart]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center pt-24 pb-16 px-4">
        <p className="text-gray-300">Cargando estado de la orden...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center pt-24 pb-16 px-4">
        <div className="text-center p-6 bg-[#111] rounded-lg border border-white/10 max-w-md w-full">
          <XCircle size={60} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Error al cargar la orden</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link href="/tienda" className="bg-cyan-500 text-black font-bold py-2 px-4 rounded-md hover:bg-cyan-400 transition">
            Volver a la Tienda
          </Link>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen flex items-center justify-center pt-24 pb-16 px-4">
        <div className="text-center p-6 bg-[#111] rounded-lg border border-white/10 max-w-md w-full">
          <XCircle size={60} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Orden no encontrada</h1>
          <p className="text-gray-400 mb-6">La orden que buscas no existe o ha sido eliminada.</p>
          <Link href="/tienda" className="bg-cyan-500 text-black font-bold py-2 px-4 rounded-md hover:bg-cyan-400 transition">
            Volver a la Tienda
          </Link>
        </div>
      </main>
    );
  }

  const isSuccess = order.status === "COMPLETED" || order.status === "PAID";
  const isPending = order.status === "PENDING_PAYMENT";

  return (
    <main className="min-h-screen flex items-center justify-center pt-24 pb-16 px-4">
      <div className="text-center p-6 bg-[#111] rounded-lg border border-white/10 max-w-md w-full">
        {isSuccess && <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />}
        {isPending && <Clock size={60} className="text-yellow-500 mx-auto mb-4" />}
        {!isSuccess && !isPending && <XCircle size={60} className="text-red-500 mx-auto mb-4" />}

        <h1 className="text-2xl font-bold mb-2">
          {isSuccess && "¡Pago Exitoso!"}
          {isPending && "Pago Pendiente"}
          {!isSuccess && !isPending && "Pago Fallido"}
        </h1>

        <p className="text-gray-400 mb-2">
          {isSuccess && "Tu compra ha sido procesada exitosamente. ¡Gracias por tu pedido!"}
          {isPending && "Estamos esperando la confirmación de tu pago. Por favor, revisa tu correo para actualizaciones."}
          {!isSuccess && !isPending && "Hubo un problema con tu pago. Por favor, intenta de nuevo o contacta a soporte."}
        </p>
        <p className="text-lg font-semibold mb-4">Referencia de Orden: {order._id}</p>

        <div className="mb-6 space-y-2">
            <h2 className="text-xl font-bold mb-2">Detalles del Pedido:</h2>
            {order.items.map((item: any) => (
                <div key={item.productId} className="flex justify-between items-center text-sm text-gray-300">
                    <span>{item.name} x {item.qty}</span>
                    <span>${(item.price * item.qty).toLocaleString()}</span>
                </div>
            ))}
            <div className="flex justify-between items-center text-lg font-bold text-white border-t border-white/10 pt-2 mt-2">
                <span>Total:</span>
                <span>${order.totalAmount.toLocaleString()}</span>
            </div>
        </div>

        <Link href="/tienda" className="bg-cyan-500 text-black font-bold py-2 px-4 rounded-md hover:bg-cyan-400 transition inline-flex items-center gap-2">
          <ShoppingCart size={20} /> Volver a la Tienda
        </Link>
      </div>
    </main>
  );
}
