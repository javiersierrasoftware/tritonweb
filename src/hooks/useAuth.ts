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
  token: string | null;
  isLoading: boolean;
  logout: () => void;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Read from localStorage
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token"); // Assuming token is also stored

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedToken) {
      setToken(storedToken);
    }
    setIsLoading(false);

    // Optional: Listen for changes in localStorage from other tabs/windows
    const syncAuth = () => {
      const updatedUser = localStorage.getItem("user");
      const updatedToken = localStorage.getItem("token");
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
      setToken(updatedToken || null);
    };

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // Also remove any cookie-based token if applicable
    document.cookie = "token=; path=/; max-age=0;"; 
    setUser(null);
    setToken(null);
  };

  return { user, token, isLoading, logout };
}
