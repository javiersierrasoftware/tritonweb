"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUp } from "lucide-react"; // Added ImageUp icon

import { useAuth } from "@/hooks/useAuth"; // Assuming you have an auth hook

export default function CreateProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const { user, token } = useAuth(); // Assuming useAuth provides user and token

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (!user || user.role !== "ADMIN") {
      setError("Solo los administradores pueden crear productos.");
      setIsLoading(false);
      return;
    }

    const productFormData = new FormData();
    productFormData.append("name", formData.name);
    productFormData.append("description", formData.description);
    productFormData.append("price", formData.price);
    productFormData.append("stock", formData.stock);
    if (imageFile) {
      productFormData.append("image", imageFile);
    }

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}` // Send token for authentication
        },
        body: productFormData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al crear el producto.");
      }

      setSuccess("Producto creado exitosamente!");
      setFormData({ name: "", description: "", price: "", stock: "" }); // Clear form
      setImageFile(null);
      setImagePreview(null);
      router.push("/admin/products/manage"); // Redirect to manage page
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Crear Nuevo Producto</h1>

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
          <label htmlFor="image-upload" className="cursor-pointer flex items-center gap-2 text-cyan-300">
            <ImageUp size={20} />
            <span>{imagePreview ? "Cambiar imagen" : "Seleccionar imagen"}</span>
          </label>
          <input id="image-upload" name="image" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
          {imagePreview && <img src={imagePreview} className="mt-2 rounded-lg max-h-40" />}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-cyan-500 text-black font-bold py-2 px-4 rounded-md hover:bg-cyan-400 transition-colors disabled:opacity-50"
        >
          {isLoading ? "Creando..." : "Crear Producto"}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">{success}</p>}
      </form>
    </div>
  );
}
