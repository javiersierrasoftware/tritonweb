"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth"; // Assuming you have an auth hook

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    stock: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const { user, token } = useAuth(); // Assuming useAuth provides user and token

  useEffect(() => {
    async function fetchProduct() {
      if (!user || user.role !== "ADMIN" || !token) {
        setError("No autorizado.");
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/admin/products/${params.id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Error al cargar el producto.");
        }
        setFormData({
          name: data.name,
          description: data.description || "",
          price: data.price.toString(),
          image: data.image || "",
          stock: data.stock.toString(),
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [params.id, user, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    if (!user || user.role !== "ADMIN") {
      setError("Solo los administradores pueden editar productos.");
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/admin/products/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al actualizar el producto.");
      }

      setSuccess("Producto actualizado exitosamente!");
      // Optionally, redirect after a short delay
      // setTimeout(() => router.push("/admin/products/manage"), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="max-w-2xl mx-auto px-4 py-8 text-center">Cargando producto...</div>;
  }

  if (error) {
    return <div className="max-w-2xl mx-auto px-4 py-8 text-red-500 text-center">{error}</div>;
  }

  if (!user || user.role !== "ADMIN") {
    return <div className="max-w-2xl mx-auto px-4 py-8 text-red-500 text-center">Acceso denegado. Solo administradores.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Editar Producto</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">
            Nombre del Producto
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
          <label htmlFor="description" className="block text-sm font-medium text-gray-300">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
          ></textarea>
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-300">
            Precio
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-300">
            Stock
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            min="0"
            className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-300">
            URL de la Imagen
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-cyan-500 text-black font-bold py-2 px-4 rounded-md hover:bg-cyan-400 transition-colors disabled:opacity-50"
        >
          {isSaving ? "Guardando..." : "Guardar Cambios"}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">{success}</p>}
      </form>
    </div>
  );
}
