"use server";

import { createClient } from "@/lib/supabase/server";

export type CheckoutState = { error?: string; orderCode?: string } | null;

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
  const city = (formData.get("city") as string)?.trim();
  const note = ((formData.get("note") as string) ?? "").trim();

  if (!fullName || !phone || !email || !address || !city) {
    return { error: "Vui lòng điền đầy đủ thông tin giao hàng" };
  }

  const { data: settings } = await supabase
    .from("shipping_settings")
    .select("free_shipping_threshold, shipping_fee")
    .eq("id", 1)
    .single();
  const freeShippingThreshold = settings?.free_shipping_threshold ?? DEFAULT_FREE_SHIPPING_THRESHOLD;
  const baseShippingFee = settings?.shipping_fee ?? DEFAULT_SHIPPING_FEE;

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shippingFee = subtotal >= freeShippingThreshold ? 0 : baseShippingFee;
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
      payment_method: "cod",
      subtotal,
      shipping_fee: shippingFee,
      total,
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

  return { orderCode: order.order_code };
}
