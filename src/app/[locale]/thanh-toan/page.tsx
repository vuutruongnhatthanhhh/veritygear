import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import CheckoutView from "@/components/checkout/CheckoutView";
import { localizedPath } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Thanh toán — VERITY GEAR",
  description:
    "Hoàn tất thông tin giao hàng và thanh toán đơn hàng VERITY GEAR của bạn.",
  robots: { index: false, follow: false },
};

const DEFAULT_FREE_SHIPPING_THRESHOLD = 1500000;
const DEFAULT_SHIPPING_FEE = 35000;

export default async function CheckoutPage() {
  const supabase = await createClient();
  const locale = await getLocale();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const next = localizedPath(locale, "/thanh-toan");
    redirect({ href: { pathname: "/dang-nhap", query: { next } }, locale });
    return;
  }

  const admin = createAdminClient();
  const [{ data: profile }, { data: settings }, { data: ghnSettings }, { data: termsSettings }] = await Promise.all([
    supabase.from("profiles").select("full_name, phone, address").eq("id", user.id).single(),
    supabase.from("shipping_settings").select("free_shipping_threshold, shipping_fee").eq("id", 1).single(),
    admin.from("ghn_settings").select("enabled").eq("id", 1).single(),
    supabase.from("order_terms_settings").select("url_vi, url_en").eq("id", 1).single(),
  ]);

  const termsUrl = locale === "en" ? termsSettings?.url_en || termsSettings?.url_vi : termsSettings?.url_vi;

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
      ghnEnabled={ghnSettings?.enabled ?? false}
      termsUrl={termsUrl || "/"}
    />
  );
}
