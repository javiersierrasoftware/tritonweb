"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { AthleteCategory, SportType } from "@/types/Event";
import Link from "next/link"; // Import Link component

interface FormState {
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: SportType | "";
  distance: string;
  distances: string;
  minAge: string;
  maxAge: string;
  price: string;
  slotsLeft: string;
  image: string;

  reg1Start: string;
  reg1End: string;
  reg2Start: string;
  reg2End: string;
  reg3Start: string;
  reg3End: string;
  reg1Price: string;
  reg2Price: string;
  reg3Price: string;

  category: string[];
  shirtSizes: string[];
}

const INITIAL_STATE: FormState = {
  name: "",
  description: "",
  date: "",
  time: "",
  location: "",
  type: "",
  distance: "",
  distances: "",
  minAge: "",
  maxAge: "",
  price: "",
  slotsLeft: "",
  image: "",
  reg1Start: "",
  reg1End: "",
  reg2Start: "",
  reg2End: "",
  reg3Start: "",
  reg3End: "",
  reg1Price: "",
  reg2Price: "",
  reg3Price: "",
  category: [],
  shirtSizes: [],
};

const SHIRT_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];
const CATEGORY_OPTIONS: AthleteCategory[] = ["Principiante", "Intermedio", "Avanzado", "Elite", "Recreativo"];

export default function EditEventAdminPage() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (!id) return;

    async function fetchEventData() {
      try {
        setPageLoading(true);
        const res = await fetch(`/api/events/admin/${id}`);
        const result = await res.json();

        if (!res.ok || !result.ok) {
          throw new Error(result.message || "No se pudo cargar el evento.");
        }

        const event = result.data;
        
        // Formatear fechas para los inputs de tipo 'date'
        const formatDateForInput = (date: string) => date ? new Date(date).toISOString().split('T')[0] : "";

        setForm({
          name: event.name || "",
          description: event.description || "",
          date: formatDateForInput(event.date),
          time: event.time || "",
          location: event.location || "",
          type: event.type || "",
          distance: event.distance || "",
          distances: (event.distances || []).join(", "),
          minAge: event.minAge?.toString() || "",
          maxAge: event.maxAge?.toString() || "",
          price: event.price || "",
          slotsLeft: event.slotsLeft?.toString() || "",
          image: event.image || "",
          category: event.category || "",
          shirtSizes: event.shirtSizes || [],
          reg1Start: formatDateForInput(event.registrationPeriods?.[0]?.startDate),
          reg1End: formatDateForInput(event.registrationPeriods?.[0]?.endDate),
          reg2Start: formatDateForInput(event.registrationPeriods?.[1]?.startDate),
          reg2End: formatDateForInput(event.registrationPeriods?.[1]?.endDate),
          reg3Start: formatDateForInput(event.registrationPeriods?.[2]?.startDate),
          reg3End: formatDateForInput(event.registrationPeriods?.[2]?.endDate),
          reg1Price: event.registrationPeriods?.[0]?.price || "",
          reg2Price: event.registrationPeriods?.[1]?.price || "",
          reg3Price: event.registrationPeriods?.[2]?.price || "",
        });
      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        setPageLoading(false);
      }
    }

    fetchEventData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const toggleShirtSize = (size: string) => {
    setForm((prev) => {
      const exists = prev.shirtSizes.includes(size);
      return {
        ...prev,
        shirtSizes: exists
          ? prev.shirtSizes.filter((s) => s !== size)
          : [...prev.shirtSizes, size],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setErrorMsg(null);
    setLoading(true);

    try {
      const registrationPeriods = [
        form.reg1Start && form.reg1End ? { label: "Preventa", startDate: form.reg1Start, endDate: form.reg1End, price: form.reg1Price } : null,
        form.reg2Start && form.reg2End ? { label: "Inscripción regular", startDate: form.reg2Start, endDate: form.reg2End, price: form.reg2Price } : null,
        form.reg3Start && form.reg3End ? { label: "Inscripción tardía", startDate: form.reg3Start, endDate: form.reg3End, price: form.reg3Price } : null,
      ].filter(Boolean);

      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key !== 'shirtSizes' && key !== 'registrationPeriods' && !key.startsWith('reg') && key !== 'category') {
          if (value && key !== 'image') { // No incluir la URL de la imagen vieja aquí
            formData.append(key, value as string);
          }
        }
      });
      
      formData.append("shirtSizes", JSON.stringify(form.shirtSizes));
      formData.append("registrationPeriods", JSON.stringify(registrationPeriods));
      formData.append("category", JSON.stringify(form.category));
      formData.append("currentImage", form.image); // Enviamos la URL actual por si no se cambia

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch(`/api/events/admin/${id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Error al actualizar el evento");
      }

      setFeedback("¡Evento actualizado exitosamente! Redirigiendo...");

      setTimeout(() => {
        router.push("/events");
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || "Error inesperado al actualizar el evento");
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (cat: AthleteCategory) => {
    setForm((prev) => {
      const exists = prev.category.includes(cat);
      if (exists) {
        return {
          ...prev,
          category: prev.category.filter((c) => c !== cat),
        };
      }
      return {
        ...prev,
        category: [...prev.category, cat],
      };
    });
  };

  if (pageLoading) {
    return <div className="text-center py-40">Cargando datos del evento...</div>;
  }

  return (
    <main className="min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Editar Evento</h1>
            <p className="text-gray-400 text-sm">
              Modifica los detalles del evento.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs border border-emerald-500/40">
            Modo ADMIN
          </span>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-6"
        >
          {/* INFO BÁSICA */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Información general</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300">Nombre del evento</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">Tipo / Deporte</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm"
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="Carrera">Carrera</option>
                  <option value="Triatlón">Triatlón</option>
                  <option value="Ciclismo">Ciclismo</option>
                  <option value="Natación">Natación</option>
                  <option value="Entrenamiento">Entrenamiento</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-300">Fecha del evento</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">Hora</label>
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-gray-300">Lugar / Ciudad</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Ej: Sincelejo - Salida desde el estadio 20 de Enero"
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-300">Descripción</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm resize-none"
                placeholder="Describe brevemente la experiencia, recorrido, servicios incluidos, etc."
              />
            </div>
          </section>

          {/* DISTANCIAS Y CATEGORÍAS */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Distancias y categorías</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300">
                  Distancia principal (texto corto)
                </label>
                <input
                  type="text"
                  name="distance"
                  value={form.distance}
                  onChange={handleChange}
                  placeholder="Ej: 10K, Fondo 80K, etc."
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">
                  Distancias disponibles (separadas por coma)
                </label>
                <input
                  type="text"
                  name="distances"
                  value={form.distances}
                  onChange={handleChange}
                  placeholder="Ej: 5K, 10K, 21K"
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">
                  Categoría del deportista
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {CATEGORY_OPTIONS.map((cat) => {
                    const active = form.category.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`px-3 py-1 rounded-full border text-xs ${
                          active
                            ? "bg-cyan-300 text-black border-cyan-300"
                            : "border-white/20 text-gray-200 bg-white/5"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-300">Edad mínima</label>
                  <input
                    type="number"
                    name="minAge"
                    value={form.minAge}
                    onChange={handleChange}
                    min={0}
                    className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300">Edad máxima</label>
                  <input
                    type="number"
                    name="maxAge"
                    value={form.maxAge}
                    onChange={handleChange}
                    min={0}
                    className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-300">Tallas de camiseta</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {SHIRT_OPTIONS.map((size) => {
                  const active = form.shirtSizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleShirtSize(size)}
                      className={`px-3 py-1 rounded-full border text-xs ${
                        active
                          ? "bg-cyan-300 text-black border-cyan-300"
                          : "border-white/20 text-gray-200 bg-white/5"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ECONOMÍA Y CUPOS */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Cupos y valor</h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-300">
                  Precio de inscripción (texto)
                </label>
                <input
                  type="text"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Ej: $120.000"
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">Cupos disponibles</label>
                <input
                  type="number"
                  name="slotsLeft"
                  value={form.slotsLeft}
                  onChange={handleChange}
                  min={0}
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">Imagen del evento (banner)</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-300 file:text-black hover:file:bg-cyan-400"
                />
              </div>
            </div>
          </section>

          {/* RANGOS DE FECHAS DE INSCRIPCIÓN */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Rangos de inscripción</h2>
            <div className="grid md:grid-cols-3 gap-4 text-xs">
              <div className="space-y-2 border border-white/10 rounded-xl p-3">
                <p className="font-semibold">Preventa</p>
                <label className="block text-gray-300">
                  Inicio
                  <input type="date" name="reg1Start" value={form.reg1Start} onChange={handleChange} className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-2 py-1" />
                </label>
                <label className="block text-gray-300">
                  Fin
                  <input type="date" name="reg1End" value={form.reg1End} onChange={handleChange} className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-2 py-1" />
                </label>
                <label className="block text-gray-300">
                  Precio
                  <input type="text" name="reg1Price" value={form.reg1Price} onChange={handleChange} placeholder="$100.000" className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-2 py-1" />
                </label>
              </div>

              <div className="space-y-2 border border-white/10 rounded-xl p-3">
                <p className="font-semibold">Inscripción regular</p>
                <label className="block text-gray-300">
                  Inicio
                  <input type="date" name="reg2Start" value={form.reg2Start} onChange={handleChange} className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-2 py-1" />
                </label>
                <label className="block text-gray-300">
                  Fin
                  <input type="date" name="reg2End" value={form.reg2End} onChange={handleChange} className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-2 py-1" />
                </label>
                <label className="block text-gray-300">
                  Precio
                  <input type="text" name="reg2Price" value={form.reg2Price} onChange={handleChange} placeholder="$120.000" className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-2 py-1" />
                </label>
              </div>

              <div className="space-y-2 border border-white/10 rounded-xl p-3">
                <p className="font-semibold">Inscripción tardía</p>
                <label className="block text-gray-300">
                  Inicio
                  <input type="date" name="reg3Start" value={form.reg3Start} onChange={handleChange} className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-2 py-1" />
                </label>
                <label className="block text-gray-300">
                  Fin
                  <input type="date" name="reg3End" value={form.reg3End} onChange={handleChange} className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-2 py-1" />
                </label>
                <label className="block text-gray-300">
                  Precio
                  <input type="text" name="reg3Price" value={form.reg3Price} onChange={handleChange} placeholder="$150.000" className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-2 py-1" />
                </label>
              </div>
            </div>
          </section>

          {feedback && <p className="text-sm text-emerald-400">{feedback}</p>}
          {errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}

          <div className="flex justify-end gap-4">
            <button
              type="button" // Important: type="button" to prevent form submission
              onClick={() => router.push("/events/manage")}
              className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold px-6 py-2 rounded-full hover:bg-white/20 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-gradient-to-br from-cyan-300 to-orange-300 text-black font-semibold px-6 py-2 rounded-full disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
