"use client";

import { create } from "zustand";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  img: string; // ✅ NECESARIO PARA ProductCard
}

interface CartStore {
  items: CartItem[];
  toggleCart: () => void;
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "qty">) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  isOpen: false,

  toggleCart: () =>
    set((state) => ({ isOpen: !state.isOpen })),

  addItem: (item) =>
    set((state) => {
      // si ya existe, aumentar cantidad
      const existing = state.items.find((i) => i.id === item.id);

      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }

      // agregar nuevo
      return {
        items: [...state.items, { ...item, qty: 1 }],
      };
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  clearCart: () =>
    set(() => ({
      items: [],
    })),
}));