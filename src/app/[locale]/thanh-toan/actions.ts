"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ghnCalculateFee } from "@/lib/ghn";
import { getPayOS } from "@/lib/payos";
import { sendNewOrderNotification } from "@/lib/orderNotification";

export type CheckoutState = { error?: string; orderCode?: string; paymentUrl?: string } | null;

const DEFAULT_FREE_SHIPPING_THRESHOLD = 1500000;
const DEFAULT_SHIPPING_FEE = 35000;

type CartItemInput = { slug: string; name: string; image: string; price: number; qty: number };

function parseItems(raw: string | null): CartItemInput[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((i) => i && typeof i === "object" && typeof i.slug === "string" && typeof i.qty === "number")
      .map((i) => ({
        slug: String(i.slug),
        name: String(i.name ?? ""),
        image: String(i.image ?? ""),
        price: Number(i.price) || 0,
        qty: Number(i.qty) || 0,
      }))
      .filter((i) => i.qty > 0);
  } catch {
    return [];
  }
}

async function siteOrigin(): Promise<string> {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host = h.get("host");
  return `${proto}://${host}`;
}

export async function placeOrder(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Bạn cần đăng nhập để đặt hàng" };

  const items = parseItems(formData.get("items_json") as string | null);
  if (items.length === 0) return { error: "Giỏ hàng đang trống" };

  const fullName = (formData.get("fullName") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const address = (formData.get("address") as string)?.trim();
  const note = ((formData.get("note") as string) ?? "").trim();
  const paymentMethod: "cod" | "transfer" = (formData.get("payment") as string) === "transfer" ? "transfer" : "cod";

  const toProvinceIdRaw = (formData.get("to_province_id") as string) || "";
  const toProvinceName = ((formData.get("to_province_name") as string) ?? "").trim();
  const toDistrictIdRaw = (formData.get("to_district_id") as string) || "";
  const toDistrictName = ((formData.get("to_district_name") as string) ?? "").trim();
  const toWardCode = ((formData.get("to_ward_code") as string) ?? "").trim();
  const toWardName = ((formData.get("to_ward_name") as string) ?? "").trim();

  const admin = createAdminClient();
  const { data: ghnSettings } = await admin.from("ghn_settings").select("*").eq("id", 1).single();
  const ghnEnabled = !!ghnSettings?.enabled;

  const city = ghnEnabled ? toProvinceName : ((formData.get("city") as string)?.trim() ?? "");

  if (!fullName || !phone || !email || !address || !city) {
    return { error: "Vui lòng điền đầy đủ thông tin giao hàng" };
  }
  if (ghnEnabled && (!toProvinceIdRaw || !toDistrictIdRaw || !toWardCode)) {
    return { error: "Vui lòng chọn đầy đủ Tỉnh/Thành, Quận/Huyện, Phường/Xã" };
  }

  const { data: settings } = await supabase
    .from("shipping_settings")
    .select("free_shipping_threshold, shipping_fee")
    .eq("id", 1)
    .single();
  const freeShippingThreshold = settings?.free_shipping_threshold ?? DEFAULT_FREE_SHIPPING_THRESHOLD;
  const baseShippingFee = settings?.shipping_fee ?? DEFAULT_SHIPPING_FEE;

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  let shippingFee = subtotal >= freeShippingThreshold ? 0 : baseShippingFee;
  let shippingProvider: "manual" | "ghn" = "manual";

  if (ghnEnabled && ghnSettings?.token && ghnSettings?.shop_id) {
    try {
      const slugs = items.map((i) => i.slug);
      const { data: products } = await admin.from("products").select("slug, weight_grams").in("slug", slugs);
      const weightBySlug = new Map((products ?? []).map((p) => [p.slug, p.weight_grams]));
      const totalWeight = items.reduce((sum, i) => sum + (weightBySlug.get(i.slug) ?? 500) * i.qty, 0);

      shippingFee = await ghnCalculateFee(
        { token: ghnSettings.token, shopId: ghnSettings.shop_id },
        {
          serviceTypeId: ghnSettings.service_type_id,
          toDistrictId: parseInt(toDistrictIdRaw),
          toWardCode,
          weightGrams: totalWeight,
        },
      );
      shippingProvider = "ghn";
    } catch (err) {
      console.error("GHN fee calculation failed, falling back to flat fee:", err);
    }
  }

  const total = subtotal + shippingFee;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      full_name: fullName,
      phone,
      email,
      address,
      city,
      note,
      payment_method: paymentMethod,
      subtotal,
      shipping_fee: shippingFee,
      total,
      to_province_id: toProvinceIdRaw ? parseInt(toProvinceIdRaw) : null,
      to_province_name: toProvinceName || null,
      to_district_id: toDistrictIdRaw ? parseInt(toDistrictIdRaw) : null,
      to_district_name: toDistrictName || null,
      to_ward_code: toWardCode || null,
      to_ward_name: toWardName || null,
      shipping_provider: shippingProvider,
    })
    .select("id, order_code")
    .single();

  if (orderError || !order) return { error: orderError?.message ?? "Không thể tạo đơn hàng" };

  const { error: itemsError } = await supabase.from("order_items").insert(
    items.map((i) => ({
      order_id: order.id,
      product_slug: i.slug,
      product_name: i.name,
      product_image: i.image,
      price: i.price,
      qty: i.qty,
    })),
  );

  if (itemsError) return { error: itemsError.message };

  const emailFields = {
    orderCode: order.order_code,
    fullName,
    phone,
    email,
    address,
    wardName: toWardName,
    districtName: toDistrictName,
    city,
    note,
    items,
    subtotal,
    shippingFee,
    total,
    paymentMethod,
  };

  if (paymentMethod === "cod") {
    await sendNewOrderNotification(emailFields);
    return { orderCode: order.order_code };
  }

  // Bank transfer: hold off on the notification email until PayOS confirms
  // payment via webhook — send it now would mean unpaid orders get treated
  // the same as confirmed ones.
  try {
    const origin = await siteOrigin();
    const paymentLink = await getPayOS().paymentRequests.create({
      orderCode: order.id,
      amount: total,
      description: `DH ${order.order_code}`.slice(0, 25),
      items: items.map((i) => ({ name: i.name, quantity: i.qty, price: i.price })),
      // Use "oc" (not "orderCode") — PayOS appends its own `orderCode` query
      // param (its numeric code, i.e. order.id) to this URL on redirect,
      // which would silently clobber ours (the human-readable order_code)
      // if we used the same key name.
      returnUrl: `${origin}/thanh-toan/ket-qua?oc=${order.order_code}`,
      cancelUrl: `${origin}/thanh-toan/ket-qua?oc=${order.order_code}`,
    });
    return { paymentUrl: paymentLink.checkoutUrl };
  } catch (err) {
    console.error("Failed to create PayOS payment link:", err);
    await admin.from("orders").delete().eq("id", order.id);
    return { error: "Không thể tạo link thanh toán chuyển khoản. Vui lòng thử lại hoặc chọn COD." };
  }
}
