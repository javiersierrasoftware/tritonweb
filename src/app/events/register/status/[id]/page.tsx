"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";

type Status = "PENDING_PAYMENT" | "COMPLETED" | "FAILED" | "LOADING" | "ERROR";

export default function RegistrationStatusPage() {
  const [status, setStatus] = useState<Status>("LOADING");
  const [error, setError] = useState<string | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);
  const params = useParams();
  const registrationId = params.id;

  useEffect(() => {
    if (!registrationId) {
      console.warn("Registration ID is missing from URL parameters.");
      setStatus("ERROR");
      setError("Registration ID is missing.");
      return;
    }
    console.log("Polling status for registration ID:", registrationId);

    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/registrations/${registrationId}`);
        if (!response.ok) {
          const responseText = await response.text(); // Read raw text
          console.error("API response not OK:", response.status, responseText);
          try {
            const data = JSON.parse(responseText);
            throw new Error(data.message || "Could not fetch registration status.");
          } catch {
            // If it's not JSON, throw a generic error or the raw text
            throw new Error(`Server returned non-JSON response: ${responseText.substring(0, 100)}...`);
          }
        }
        const data = await response.json(); // <-- This line is likely causing the error
        setStatus(data.status);
        if (data.event) {
          setEventId(data.event);
        }
        return data.status;
      } catch (err: any) {
        console.error("Error in pollStatus:", err);
        setError(err.message);
        setStatus("ERROR");
        return "ERROR";
      }
    };

    // Fetch status once on load
    pollStatus();

    // No longer poll, only fetch once.
    // Clean up function is now empty as there's no interval to clear.
    return () => {};
  }, [registrationId]);

  const renderContent = () => {
    switch (status) {
      case "LOADING":
      case "PENDING_PAYMENT":
        return (
          <>
            <Loader2 className="h-16 w-16 text-cyan-400 animate-spin" />
            <h1 className="mt-4 text-3xl font-bold">Procesando Pago</h1>
            <p className="mt-2 text-gray-400">
              Estamos confirmando tu pago con Wompi. Por favor no cierres esta ventana.
            </p>
          </>
        );
      case "COMPLETED":
        return (
          <>
            <CheckCircle className="h-16 w-16 text-green-500" />
            <h1 className="mt-4 text-3xl font-bold">¡Inscripción Confirmada!</h1>
            <p className="mt-2 text-gray-400">
              Tu pago ha sido procesado exitosamente. ¡Nos vemos en el evento!
            </p>
            {eventId && (
              <Link href={`/events/${eventId}`} className="mt-6 inline-block bg-cyan-500 px-6 py-2 rounded-md font-semibold text-black hover:bg-cyan-400">
                  Volver al Evento
              </Link>
            )}
          </>
        );
      case "FAILED":
        return (
          <>
            <XCircle className="h-16 w-16 text-red-500" />
            <h1 className="mt-4 text-3xl font-bold">Pago Fallido</h1>
            <p className="mt-2 text-gray-400">
              Hubo un problema procesando tu pago. Por favor, inténtalo de nuevo.
            </p>
             {eventId && (
              <Link href={`/events/register/${eventId}`} className="mt-6 inline-block bg-cyan-500 px-6 py-2 rounded-md font-semibold text-black hover:bg-cyan-400">
                  Intentar de Nuevo
              </Link>
            )}
          </>
        );
      case "ERROR":
        return (
           <>
            <AlertCircle className="h-16 w-16 text-yellow-500" />
            <h1 className="mt-4 text-3xl font-bold">Error</h1>
            <p className="mt-2 text-gray-400">
              {error || "Ocurrió un error inesperado. Por favor contacta a soporte."}
            </p>
             {eventId && (
              <Link href={`/events/${eventId}`} className="mt-6 inline-block bg-cyan-500 px-6 py-2 rounded-md font-semibold text-black hover:bg-cyan-400">
                  Volver al Evento
              </Link>
            )}
          </>
        )
    }
  };

  return (
    <main className="flex items-center justify-center min-h-[70vh]">
      <div className="text-center p-8 bg-gray-800/50 rounded-lg shadow-xl max-w-lg">
        {renderContent()}
      </div>
    </main>
  );
}
