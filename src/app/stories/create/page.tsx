"use client";

import { useState, useEffect } from "react";
import CreateStoryForm from "@/components/CreateStoryForm";
import AdminAuthGuard from "@/components/auth/AdminAuthGuard";
import { ShieldCheck } from "lucide-react";

import { useSession } from "next-auth/react";

function CreateStoryPageContent() {
  const { data: session } = useSession();
  const user = session?.user;

  // Render form only if user exists (AuthGuard ensures they are admin)
  if (!user) return null;

  return (
    <main className="max-w-2xl mx-auto px-4 pt-24 pb-16 space-y-8">
      {/* TÍTULO */}
      <div className="flex items-center gap-3">
        <ShieldCheck size={30} className="text-orange-300" />
        <h1 className="text-3xl font-bold">Crear Nueva Historia</h1>
      </div>

      {/* FORMULARIO */}
      <CreateStoryForm
        user={{ name: user.name || "Admin", email: user.email || "" }}
      />
    </main>
  );
}

export default function CreateStoryPage() {
  return (
    <AdminAuthGuard>
      <CreateStoryPageContent />
    </AdminAuthGuard>
  )
}