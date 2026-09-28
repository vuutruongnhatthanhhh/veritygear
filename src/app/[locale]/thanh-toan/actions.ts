"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTransporter, hasSmtpConfig, emailLayout, emailButtonHtml } from "@/lib/mailer";
import { formatVnd } from "@/lib/format";
import { ghnCalculateFee } from "@/lib/ghn";

export type CheckoutState = { error?: string; orderCode?: string } | null;

const DEFAULT_FREE_SHIPPING_THRESHOLD = 1500000;
const DEFAULT_SHIPPING_FEE = 35000;

type CartItemInput = { slug: string; name: string; image: string; price: number; qty: number };

type NewOrderEmailFields = {
  orderCode: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  wardName: string;
  districtName: string;
  city: string;
  note: string;
  items: CartItemInput[];
  subtotal: number;
  shippingFee: number;
  total: number;
};

function fullAddress(o: NewOrderEmailFields): string {
  return [o.address, o.wardName, o.districtName, o.city].filter(Boolean).join(", ");
}

function newOrderEmailHtml(o: NewOrderEmailFields) {
  const itemRows = o.items
    .map(
      (i) =>
        `<p style="color:#444; line-height:1.6; margin:4px 0;">${i.name} × ${i.qty} — ${formatVnd(i.price * i.qty)}</p>`,
    )
    .join("");

  return emailLayout(`
    <h2 style="margin:0 0 12px; font-size: 20px;">Đơn hàng mới: ${o.orderCode}</h2>
    <p style="color:#444; line-height:1.6;"><strong>Khách hàng:</strong> ${o.fullName}</p>
    <p style="color:#444; line-height:1.6;"><strong>Điện thoại:</strong> ${o.phone}</p>
    <p style="color:#444; line-height:1.6;"><strong>Email:</strong> ${o.email}</p>
    <p style="color:#444; line-height:1.6;"><strong>Địa chỉ:</strong> ${fullAddress(o)}</p>
    ${o.note ? `<p style="color:#444; line-height:1.6;"><strong>Ghi chú:</strong> ${o.note}</p>` : ""}
    <p style="color:#444; line-height:1.6;"><strong>Thanh toán:</strong> Khi nhận hàng (COD)</p>
    <hr style="border:none; border-top:1px solid #eee; margin:20px 0;" />
    ${itemRows}
    <p style="color:#444; line-height:1.6; margin-top:16px;">Tạm tính: ${formatVnd(o.subtotal)}</p>
    <p style="color:#444; line-height:1.6;">Vận chuyển: ${o.shippingFee === 0 ? "Miễn phí" : formatVnd(o.shippingFee)}</p>
    <p style="color:#0A0A0A; line-height:1.6; font-weight:700;">Tổng cộng: ${formatVnd(o.total)}</p>
    ${emailButtonHtml(`mailto:${o.email}`, "LIÊN HỆ KHÁCH HÀNG")}
  `);
}

function newOrderEmailText(o: NewOrderEmailFields) {
  const itemLines = o.items.map((i) => `${i.name} x${i.qty} - ${formatVnd(i.price * i.qty)}`).join("\n");
  return `Đơn hàng mới: ${o.orderCode}\n\nKhách hàng: ${o.fullName}\nĐiện thoại: ${o.phone}\nEmail: ${o.email}\nĐịa chỉ: ${fullAddress(o)}${
    o.note ? `\nGhi chú: ${o.note}` : ""
  }\nThanh toán: Khi nhận hàng (COD)\n\n${itemLines}\n\nTạm tính: ${formatVnd(o.subtotal)}\nVận chuyển: ${
    o.shippingFee === 0 ? "Miễn phí" : formatVnd(o.shippingFee)
  }\nTổng cộng: ${formatVnd(o.total)}`;
}

async function sendNewOrderNotification(fields: NewOrderEmailFields) {
  if (!hasSmtpConfig()) return;

  try {
    const admin = createAdminClient();
    const { data: settings } = await admin.from("contact_settings").select("recipient_email").eq("id", 1).single();
    const recipientEmail = settings?.recipient_email;
    if (!recipientEmail) return;

    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"VERITY GEAR" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      replyTo: fields.email,
      subject: `Đơn hàng mới: ${fields.orderCode}`,
      text: newOrderEmailText(fields),
      html: newOrderEmailHtml(fields),
    });
  } catch (err) {
    console.error("Failed to send new order notification email:", err);
  }
}

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
  const note = ((formData.get("note") as string) ?? "").trim();

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
      payment_method: "cod",
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

  await sendNewOrderNotification({
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
  });

  return { orderCode: order.order_code };
}
