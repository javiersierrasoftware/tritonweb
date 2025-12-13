"use client";

import ManageEvents from "@/components/events/ManageEvents";
import AdminAuthGuard from "@/components/auth/AdminAuthGuard";

function ManageEventsPageContent() {
  return (
    <main className="max-w-6xl mx-auto px-4 pt-28 pb-16 space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Gestionar Eventos</h1>
        <p className="text-gray-400 text-sm mt-1">
          Panel para editar, destacar o eliminar eventos publicados.
        </p>
      </header>

      <ManageEvents />
    </main>
  );
}

export default function ManageEventsPage() {
    return (
        <AdminAuthGuard>
            <ManageEventsPageContent />
        </AdminAuthGuard>
    )
}
