"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { Loader2 } from 'lucide-react';
import AdminAuthGuard from "@/components/auth/AdminAuthGuard";

interface HeroSlide {
  _id: string;
  image: string;
  title: string;
  subtitle: string;
  buttonLink: string;
  order: number;
}

function ManageHeroSliderPageContent() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState<HeroSlide | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    buttonLink: "",
    order: "",
    image: null as File | null,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchSlides = async () => {
    setError(null);
    try {
      const res = await fetch("/api/admin/hero-slider", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Error al cargar los slides.");
      }
      if (Array.isArray(data)) {
        setSlides(data);
      } else {
        throw new Error(data.message || "La respuesta del servidor no es válida.");
      }
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado.");
      setSlides([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, image: null });
      setPreviewImage(null);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", subtitle: "", buttonLink: "", order: "", image: null });
    setPreviewImage(null);
    setCurrentSlide(null);
    setIsModalOpen(false);
    setIsSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("subtitle", formData.subtitle);
    data.append("buttonLink", formData.buttonLink);
    data.append("order", formData.order);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      const url = currentSlide ? `/api/admin/hero-slider/${currentSlide._id}` : "/api/admin/hero-slider";
      const method = currentSlide ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: data,
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save hero slide");
      }

      toast.success("Hero slide guardado con éxito!");
      resetForm();
      await fetchSlides();
    } catch (error: any) {
      toast.error(error.message || "Error saving hero slide.");
      setIsSubmitting(false);
    }
  };

  const handleEdit = (slide: HeroSlide) => {
    setCurrentSlide(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      buttonLink: slide.buttonLink,
      order: slide.order.toString(),
      image: null,
    });
    setPreviewImage(slide.image);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this hero slide?")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/hero-slider/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete hero slide");
      }

      toast.success("Hero slide eliminado con éxito!");
      await fetchSlides();
    } catch (error: any) {
      toast.error(error.message || "Error deleting hero slide.");
    }
  };

  if (isLoading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[70vh] p-8">
        <Loader2 className="h-16 w-16 text-cyan-400 animate-spin" />
        <p className="mt-4 text-xl text-gray-400">Cargando...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[70vh] p-8">
        <p className="text-red-500 text-xl">{error}</p>
        <p className="text-gray-400 mt-2">Asegúrate de haber iniciado sesión como Administrador.</p>
      </main>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Administrar Hero Slider</h1>
        <button
          onClick={() => {
            setIsModalOpen(true);
            setCurrentSlide(null);
            setFormData({ title: "", subtitle: "", buttonLink: "", order: "", image: null });
            setPreviewImage(null);
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Agregar Nuevo Slide
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full border border-cyan-400/30">
            <h2 className="text-xl font-bold mb-4 text-white">
              {currentSlide ? "Editar Slide" : "Crear Nuevo Slide"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300">Title</label>
                <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 text-white" required />
              </div>
              <div>
                <label htmlFor="subtitle" className="block text-sm font-medium text-gray-300">Subtitle</label>
                <textarea name="subtitle" id="subtitle" value={formData.subtitle} onChange={handleChange} rows={3} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 text-white" required ></textarea>
              </div>
              <div>
                <label htmlFor="buttonLink" className="block text-sm font-medium text-gray-300">Button Link (URL)</label>
                <input type="url" name="buttonLink" id="buttonLink" value={formData.buttonLink} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 text-white" required />
              </div>
              <div>
                <label htmlFor="order" className="block text-sm font-medium text-gray-300">Order (Number)</label>
                <input type="number" name="order" id="order" value={formData.order} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 text-white" required />
              </div>
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-300">Image</label>
                <input type="file" name="image" id="image" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-700 file:text-cyan-100 hover:file:bg-cyan-600"/>
                {previewImage && <div className="mt-2 w-32 h-24 relative border rounded-md overflow-hidden"><Image src={previewImage} alt="Image Preview" layout="fill" objectFit="cover" /></div>}
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={resetForm} disabled={isSubmitting} className="bg-gray-600 hover:bg-gray-500 text-gray-100 font-bold py-2 px-4 rounded disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? 'Guardando...' : (currentSlide ? "Actualizar" : "Crear")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-[#111] rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
        <thead className="bg-[#181818]">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Image</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Title</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Subtitle</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Order</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {slides.map((slide) => (
              <tr key={slide._id}>
                <td className="px-6 py-4"><div className="w-16 h-9 relative rounded-md overflow-hidden"><Image src={slide.image} alt={slide.title} layout="fill" objectFit="cover"/></div></td>
                <td className="px-6 py-4">{slide.title}</td>
                <td className="px-6 py-4 text-sm text-gray-400">{slide.subtitle.substring(0, 50)}...</td>
                <td className="px-6 py-4">{slide.order}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleEdit(slide)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded text-xs mr-2">Edit</button>
                  <button onClick={() => handleDelete(slide._id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ManageHeroSlider() {
  return (
    <AdminAuthGuard>
      <ManageHeroSliderPageContent />
    </AdminAuthGuard>
  )
}