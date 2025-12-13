"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.role === "ADMIN") {
          setIsAuthorized(true);
        } else {
          router.replace("/login"); // Or a '/unauthorized' page
        }
      } else {
        router.replace("/login");
      }
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        router.replace("/login");
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <Loader2 className="h-12 w-12 animate-spin text-cyan-400" />
        <p className="mt-4 text-gray-400">Verificando autorización...</p>
      </main>
    );
  }

  return <>{children}</>;
}
