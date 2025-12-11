"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface RequestFormState {
  organizerName: string;
  organizerEmail: string;
  organizerPhone: string;

  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  sportType: string;
  distances: string;
  price: string;

  acceptTerms: boolean;
}

const INITIAL_REQUEST: RequestFormState = {
  organizerName: "",
  organizerEmail: "",
  organizerPhone: "",
  name: "",
  description: "",
  date: "",
  time: "",
  location: "",
  sportType: "",
  distances: "",
  price: "",
  acceptTerms: false,
};

export default function RequestEventPage() {
  const [form, setForm] = useState<RequestFormState>(INITIAL_REQUEST);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as any;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setErrorMsg(null);
    setLoading(true);

    try {
      const payload = {
        ...form,
      };

      const res = await fetch("/api/events/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Error al enviar la solicitud");
      }

      setFeedback(
        "Solicitud enviada. Te contactaremos al correo registrado una vez sea revisada."
      );
      setForm(INITIAL_REQUEST);

      setTimeout(() => {
        router.push("/events");
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "Error inesperado al enviar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">
            Solicitar publicación de tu evento
          </h1>
          <p className="text-gray-400 text-sm">
            Si eres organizador de una carrera, fondo o evento deportivo, puedes
            solicitar visibilidad en la plataforma TRITON. Nuestro equipo
            revisará la información y te contactará para confirmar condiciones y
            costos.
          </p>
        </header>

        <section className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-4 text-sm">
          <h2 className="text-base font-semibold">Condiciones generales</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>
              La publicación del evento está sujeta a revisión por parte del
              equipo TRITON.
            </li>
            <li>
              Se aplican costos por difusión del evento en nuestros canales
              oficiales y por el uso de la plataforma de inscripciones.
            </li>
            <li>
              El organizador es responsable de permisos, pólizas, seguridad y
              logística del evento.
            </li>
            <li>
              Nos reservamos el derecho de aprobar o rechazar solicitudes que no
              cumplan con la filosofía de la comunidad.
            </li>
          </ul>
        </section>

        <form
          onSubmit={handleSubmit}
          className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-6 text-sm"
        >
          {/* DATOS DEL ORGANIZADOR */}
          <section className="space-y-3">
            <h2 className="text-base font-semibold">Datos del organizador</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-300">Nombre / Entidad</label>
                <input
                  type="text"
                  name="organizerName"
                  value={form.organizerName}
                  onChange={handleChange}
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="text-gray-300">Correo de contacto</label>
                <input
                  type="email"
                  name="organizerEmail"
                  value={form.organizerEmail}
                  onChange={handleChange}
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="text-gray-300">Teléfono / WhatsApp</label>
                <input
                  type="text"
                  name="organizerPhone"
                  value={form.organizerPhone}
                  onChange={handleChange}
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2"
                />
              </div>
            </div>
          </section>

          {/* DATOS DEL EVENTO */}
          <section className="space-y-3">
            <h2 className="text-base font-semibold">Datos del evento</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-gray-300">Nombre del evento</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="text-gray-300">Fecha del evento</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="text-gray-300">Hora</label>
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-gray-300">Lugar / Ciudad</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Ej: Sincelejo, salida desde..."
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="text-gray-300">Tipo de evento / Deporte</label>
                <select
                  name="sportType"
                  value={form.sportType}
                  onChange={handleChange}
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2"
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
                <label className="text-gray-300">
                  Distancias (separadas por coma)
                </label>
                <input
                  type="text"
                  name="distances"
                  value={form.distances}
                  onChange={handleChange}
                  placeholder="Ej: 5K, 10K, 21K"
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="text-gray-300">Precio de inscripción</label>
                <input
                  type="text"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Ej: $100.000"
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-300">Descripción del evento</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 resize-none"
                placeholder="Incluye información general, servicios, recorridos, etc."
              />
            </div>
          </section>

          {/* ACEPTACIÓN DE CONDICIONES */}
          <section className="space-y-2">
            <label className="inline-flex items-start gap-2 text-xs text-gray-300">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={form.acceptTerms}
                onChange={handleChange}
                className="mt-0.5"
                required
              />
              <span>
                Declaro que la información suministrada es verídica y acepto que la
                publicación de mi evento en TRITON está sujeta a revisión, así como
                a la aplicación de costos por uso de la plataforma y difusión en
                los canales oficiales.
              </span>
            </label>
          </section>

          {/* MENSAJES */}
          {feedback && (
            <p className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/40 rounded-xl px-3 py-2">
              {feedback}
            </p>
          )}
          {errorMsg && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/40 rounded-xl px-3 py-2">
              {errorMsg}
            </p>
          )}

          {/* BOTÓN */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-gradient-to-br from-cyan-300 to-orange-300 text-black font-semibold px-6 py-2 rounded-full disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Enviar solicitud"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}