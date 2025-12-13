"use client";

import { useState, useEffect } from "react";
import ManageStories from "@/components/ManageStories";
import AdminAuthGuard from "@/components/auth/AdminAuthGuard";

function ManageStoriesPageContent() {
  return (
    <main className="min-h-screen px-6 pt-28 pb-16 text-white max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Administrar Historias</h1>

      {/* Panel de administración */}
      <ManageStories />
    </main>
  );
}

export default function ManageStoriesPage() {
  return (
    <AdminAuthGuard>
      <ManageStoriesPageContent />
    </AdminAuthGuard>
  )
}