"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2, CheckCircle } from "lucide-react";

interface RegistrationButtonProps {
  eventId: string;
  eventDistance?: string;
  isLoggedIn: boolean;
}

export default function RegistrationButton({ eventId, eventDistance, isLoggedIn }: RegistrationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegistration = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/events/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId, distance: eventDistance }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error en el registro.");
      }

      // Si la respuesta es OK, el servidor ha redirigido o enviado una URL
      const data = await response.json();
      
      if (data.redirectUrl) {
         window.location.href = data.redirectUrl;
      } else {
        setIsRegistered(true);
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    // Always redirect to the registration form page to collect all details.
    // The form can be pre-filled with user data if they are logged in.
    router.push(`/events/register/${eventId}`);
  };

  if (isRegistered) {
    return (
      <div className="flex items-center justify-center gap-2 w-full bg-green-500/10 text-green-400 font-semibold px-4 py-3 rounded-xl border border-green-500/30">
        <CheckCircle size={20} />
        <span>Inscripción confirmada</span>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="flex items-center justify-center gap-3 w-full bg-cyan-400 text-black font-bold px-6 py-3 rounded-xl hover:bg-cyan-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={24} />
        ) : (
          <CreditCard size={20} />
        )}
        <span>{isLoading ? "Procesando..." : "Inscribirse Ahora"}</span>
      </button>
      {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
    </>
  );
}
