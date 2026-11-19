"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export type GuestOrderRef = { orderCode: string; token: string };
export type GuestOrderSummary = {
  order_code: string;
  status: string;
  total: number;
  currency: "VND" | "USD";
  created_at: string;
};

export async function getGuestOrderSummaries(refs: GuestOrderRef[]): Promise<GuestOrderSummary[]> {
  if (refs.length === 0) return [];
  const admin = createAdminClient();

  const results = await Promise.all(
    refs.map((ref) =>
      admin
        .from("orders")
        .select("order_code, status, total, currency, created_at")
        .eq("order_code", ref.orderCode)
        .eq("guest_token", ref.token)
        .maybeSingle(),
    ),
  );

  return results.map((r) => r.data).filter((d): d is GuestOrderSummary => !!d);
}
