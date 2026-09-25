"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "veritygear-cart";

export type CartItem = {
  slug: string;
  name: string;
  image: string;
  price: number;
  qty: number;
};

type AddableProduct = { slug: string; name: string; image: string; price: number };

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (product: AddableProduct, qty?: number) => void;
  removeItem: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  // Cart lines carry a full product snapshot (name/image/price frozen at
  // add-to-cart time) rather than just a slug — the catalog now lives in
  // Supabase, so there's no synchronous in-memory array left to re-join
  // against on every render like the old static-data version did.
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  function addItem(product: AddableProduct, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((l) => l.slug === product.slug);
      if (existing) {
        return prev.map((l) => (l.slug === product.slug ? { ...l, qty: l.qty + qty } : l));
      }
      return [...prev, { ...product, qty }];
    });
  }

  function removeItem(slug: string) {
    setItems((prev) => prev.filter((l) => l.slug !== slug));
  }

  function setQty(slug: string, qty: number) {
    if (qty < 1) {
      removeItem(slug);
      return;
    }
    setItems((prev) => prev.map((l) => (l.slug === slug ? { ...l, qty } : l)));
  }

  function clear() {
    setItems([]);
  }

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
