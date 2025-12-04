import { create } from "zustand";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: CartItem) => void;
  removeItem: (id: string) => void;
  toggleCart: () => void;
  clear: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  isOpen: false,

  addItem: (product) =>
    set((state) => {
      const exists = state.items.find((p) => p.id === product.id);

      if (exists) {
        return {
          items: state.items.map((p) =>
            p.id === product.id ? { ...p, qty: p.qty + 1 } : p
          ),
        };
      }

      return {
        items: [...state.items, { ...product, qty: 1 }],
      };
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((p) => p.id !== id),
    })),

  toggleCart: () =>
    set((state) => ({
      isOpen: !state.isOpen,
    })),

  clear: () => set({ items: [] }),
}));