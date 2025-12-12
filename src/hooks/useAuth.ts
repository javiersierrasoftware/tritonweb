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
        id: session.user.id as string,
        email: session.user.email as string,
        name: session.user.name as string,
        role: session.user.role as string,
      }
    : null;

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" }); // Redirects to /login after logout
  };

  return { user, logout: handleLogout };
}