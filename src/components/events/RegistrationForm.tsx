"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Event } from "@/types/Event";

type EventProps = Pick<Event, "price" | "distances" | "categories" | "shirtSizes"> & { _id: string };

interface RegistrationFormProps {
  event: EventProps;
  user: { id: string; email: string; name: string; role: string } | null;
  calculatedPrice: number;
}

export default function RegistrationForm({ event, user, calculatedPrice }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    cedula: "",
    gender: "Hombre", // Default gender
    phoneNumber: "",
    dateOfBirth: "", // YYYY-MM-DD format
    distance: event.distances?.[0] || "",
    category: event.categories?.[0] || "",
    tshirtSize: event.shirtSizes?.[0] || "M", // Default to first available shirt size
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/events/register/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event._id,
          ...formData,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create payment link.");
      }

      if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
      } else {
        throw new Error("No redirect URL received from server.");
      }
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
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
          placeholder="Tu nombre"
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
          placeholder="tu@email.com"
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
          placeholder="Tu número de identificación"
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
          placeholder="Ej: 3001234567"
        />
      </div>
      <div>
        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-300">
          Fecha de Nacimiento
        </label>
        <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
          className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
        />
      </div>
      {event.distances && event.distances.length > 0 && (
        <div>
          <label htmlFor="distance" className="block text-sm font-medium text-gray-300">
            Distancia
          </label>
          <select
            id="distance"
            name="distance"
            value={formData.distance}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
          >
            {event.distances.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
      )}
      {event.categories && event.categories.length > 0 && (
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-300">
            Categoría
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
          >
            {event.categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-300">
          Género
        </label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
          className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
        >
          <option value="Hombre">Hombre</option>
          <option value="Mujer">Mujer</option>
        </select>
      </div>
      {event.shirtSizes && event.shirtSizes.length > 0 && (
        <div>
          <label htmlFor="tshirtSize" className="block text-sm font-medium text-gray-300">
            Talla de Camiseta
          </label>
          <select
            id="tshirtSize"
            name="tshirtSize"
            value={formData.tshirtSize}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
          >
            {event.shirtSizes.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      )}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-cyan-500 text-black font-bold py-3 px-4 rounded-md hover:bg-cyan-400 transition-colors disabled:opacity-50"
      >
        {isLoading ? "Procesando..." : `Pagar ${calculatedPrice} COP`}
      </button>
      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
    </form>
  );
}
