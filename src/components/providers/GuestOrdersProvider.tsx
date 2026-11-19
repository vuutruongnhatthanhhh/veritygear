"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "veritygear-guest-orders";

export type GuestOrderRef = { orderCode: string; token: string; createdAt: string };

type GuestOrdersContextValue = {
  orders: GuestOrderRef[];
  addOrder: (orderCode: string, token: string) => void;
};

const GuestOrdersContext = createContext<GuestOrdersContextValue | null>(null);

export function GuestOrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<GuestOrderRef[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setOrders(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders, hydrated]);

  function addOrder(orderCode: string, token: string) {
    setOrders((prev) => {
      if (prev.some((o) => o.orderCode === orderCode)) return prev;
      return [{ orderCode, token, createdAt: new Date().toISOString() }, ...prev];
    });
  }

  return <GuestOrdersContext.Provider value={{ orders, addOrder }}>{children}</GuestOrdersContext.Provider>;
}

export function useGuestOrders() {
  const ctx = useContext(GuestOrdersContext);
  if (!ctx) throw new Error("useGuestOrders must be used within a GuestOrdersProvider");
  return ctx;
}
