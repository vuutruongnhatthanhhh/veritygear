"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useLocale } from "next-intl";
import { formatPrice } from "@/lib/format";

const ExchangeRateContext = createContext<number | null>(null);

export function ExchangeRateProvider({ rate, children }: { rate: number; children: ReactNode }) {
  return <ExchangeRateContext.Provider value={rate}>{children}</ExchangeRateContext.Provider>;
}

export function useExchangeRate(): number {
  const rate = useContext(ExchangeRateContext);
  if (rate === null) throw new Error("useExchangeRate must be used within an ExchangeRateProvider");
  return rate;
}

// Locale-aware price formatter for client components — same rules as
// `formatPrice` in @/lib/format, just with locale/rate already resolved.
export function useFormatPrice() {
  const locale = useLocale();
  const rate = useExchangeRate();
  return (amountVnd: number) => formatPrice(amountVnd, locale, rate);
}
