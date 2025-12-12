"use client";

import { useSession, signOut } from "next-auth/react";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  logout: () => void;
}

export function useAuth(): AuthState {
  const { data: session } = useSession();

  const user: User | null = session?.user
    ? {
        id: session.user.id, // Now correctly typed via next-auth.d.ts
        email: session.user.email ?? "", // Safely handle possible null/undefined
        name: session.user.name ?? "", // Safely handle possible null/undefined
        role: session.user.role, // Now correctly typed via next-auth.d.ts
      }
    : null;

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" }); // Redirects to /login after logout
  };

  return { user, logout: handleLogout };
}