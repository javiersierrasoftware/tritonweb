"use client";

import { create } from "zustand";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image?: string; // Changed from 'img' to 'image'
}

interface CartStore {
  items: CartItem[];
  toggleCart: () => void;
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "qty">) => void;
  removeItem: (productId: string) => void; // Changed from 'id' to 'productId'
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
      const existing = state.items.find((i) => i.productId === item.productId); // Changed from 'id' to 'productId'

      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === item.productId ? { ...i, qty: i.qty + 1 } : i // Changed from 'id' to 'productId'
          ),
        };
      }

      // agregar nuevo
      return {
        items: [...state.items, { ...item, qty: 1 }],
      };
    }),

  removeItem: (productId) => // Changed from 'id' to 'productId'
    set((state) => ({
      items: state.items.filter((i) => i.productId !== productId), // Changed from 'id' to 'productId'
    })),

  clearCart: () =>
    set(() => ({
      items: [],
    })),
}));