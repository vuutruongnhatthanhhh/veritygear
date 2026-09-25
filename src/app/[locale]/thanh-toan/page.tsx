import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import CheckoutView from "@/components/checkout/CheckoutView";

export const metadata: Metadata = {
  title: "Thanh toán — VERITY GEAR",
  description:
    "Hoàn tất thông tin giao hàng và thanh toán đơn hàng VERITY GEAR của bạn.",
};

const DEFAULT_FREE_SHIPPING_THRESHOLD = 1500000;
const DEFAULT_SHIPPING_FEE = 35000;

export default async function CheckoutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const locale = await getLocale();
    redirect({ href: "/dang-nhap?next=/thanh-toan", locale });
    return;
  }

  const [{ data: profile }, { data: settings }] = await Promise.all([
    supabase.from("profiles").select("full_name, phone, address").eq("id", user.id).single(),
    supabase.from("shipping_settings").select("free_shipping_threshold, shipping_fee").eq("id", 1).single(),
  ]);

  return (
    <CheckoutView
      prefill={{
        fullName: profile?.full_name ?? "",
        phone: profile?.phone ?? "",
        address: profile?.address ?? "",
        email: user.email ?? "",
      }}
      shipping={{
        freeShippingThreshold: settings?.free_shipping_threshold ?? DEFAULT_FREE_SHIPPING_THRESHOLD,
        shippingFee: settings?.shipping_fee ?? DEFAULT_SHIPPING_FEE,
      }}
    />
  );
}
