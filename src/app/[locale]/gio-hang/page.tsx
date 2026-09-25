import type { Metadata } from "next";
import CartView from "@/components/cart/CartView";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Giỏ hàng — VERITY GEAR",
  description: "Xem lại sản phẩm trong giỏ hàng trước khi tiến hành thanh toán.",
};

const DEFAULT_FREE_SHIPPING_THRESHOLD = 1500000;

export default async function CartPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("shipping_settings")
    .select("free_shipping_threshold")
    .eq("id", 1)
    .single();

  return (
    <CartView freeShippingThreshold={settings?.free_shipping_threshold ?? DEFAULT_FREE_SHIPPING_THRESHOLD} />
  );
}
