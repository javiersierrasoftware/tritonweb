"use client";

import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  logout: () => void;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Read from localStorage
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);

    // Optional: Listen for changes in localStorage from other tabs/windows
    const syncAuth = () => {
      const updatedUser = localStorage.getItem("user");
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    // Also remove any cookie-based token if applicable
    document.cookie = "token=; path=/; max-age=0;"; 
    setUser(null);
  };

  return { user, isLoading, logout };
}