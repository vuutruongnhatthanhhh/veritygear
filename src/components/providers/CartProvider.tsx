"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products } from "@/data/products";

const STORAGE_KEY = "veritygear-cart";

type CartLine = { slug: string; qty: number };

export type CartItem = {
  slug: string;
  name: string;
  image: string;
  price: number;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (slug: string, qty?: number) => void;
  removeItem: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Reading localStorage must happen post-mount to avoid an SSR/client
    // hydration mismatch, so the one-time sync-from-storage setState here
    // is intentional rather than derivable from props/state.
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  function addItem(slug: string, qty = 1) {
    setLines((prev) => {
      const existing = prev.find((l) => l.slug === slug);
      if (existing) {
        return prev.map((l) =>
          l.slug === slug ? { ...l, qty: l.qty + qty } : l,
        );
      }
      return [...prev, { slug, qty }];
    });
  }

  function removeItem(slug: string) {
    setLines((prev) => prev.filter((l) => l.slug !== slug));
  }

  function setQty(slug: string, qty: number) {
    if (qty < 1) {
      removeItem(slug);
      return;
    }
    setLines((prev) => prev.map((l) => (l.slug === slug ? { ...l, qty } : l)));
  }

  function clear() {
    setLines([]);
  }

  const items = useMemo<CartItem[]>(() => {
    return lines
      .map((line) => {
        const product = products.find((p) => p.slug === line.slug);
        if (!product) return null;
        return {
          slug: product.slug,
          name: product.name,
          image: product.image,
          price: product.price,
          qty: line.qty,
        };
      })
      .filter((item): item is CartItem => item !== null);
  }, [lines]);

  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const value: CartContextValue = {
    items,
    itemCount,
    subtotal,
    addItem,
    removeItem,
    setQty,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
