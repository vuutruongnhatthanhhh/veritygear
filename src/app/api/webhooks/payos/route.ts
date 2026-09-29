import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPayOS } from "@/lib/payos";
import { sendNewOrderNotification } from "@/lib/orderNotification";
import type { Webhook } from "@payos/node";

// PayOS signs payloads with the checksum key (verified below), so unlike the
// GHN webhook this route doesn't need a shared-secret query param.
export async function POST(request: NextRequest) {
  let body: Webhook;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  let orderCode: number;
  try {
    const verified = await getPayOS().webhooks.verify(body);
    orderCode = verified.orderCode;
  } catch (err) {
    console.error("PayOS webhook signature verification failed:", err);
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderCode)
    .maybeSingle();

  // Order not found — most likely PayOS's own webhook-URL verification ping
  // sent when the URL was registered in the dashboard. Ack with 200 either way.
  if (!order) return NextResponse.json({ ok: true });
  if (order.payment_status === "paid") return NextResponse.json({ ok: true });

  let status: string;
  try {
    const paymentLink = await getPayOS().paymentRequests.get(orderCode);
    status = paymentLink.status;
  } catch (err) {
    console.error("Failed to query PayOS payment status:", err);
    return NextResponse.json({ error: "payos_query_failed" }, { status: 502 });
  }

  if (status === "PAID") {
    const { error } = await admin
      .from("orders")
      .update({ payment_status: "paid", paid_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("id", orderCode);
    if (error) {
      console.error("Failed to mark order as paid:", error);
      return NextResponse.json({ error: "server_error" }, { status: 500 });
    }

    type OrderItemRow = { product_slug: string; product_name: string; product_image: string | null; price: number; qty: number };
    const items: OrderItemRow[] = order.order_items ?? [];
    await sendNewOrderNotification({
      orderCode: order.order_code,
      fullName: order.full_name,
      phone: order.phone,
      email: order.email,
      address: order.address,
      wardName: order.to_ward_name ?? "",
      districtName: order.to_district_name ?? "",
      city: order.city,
      note: order.note ?? "",
      items: items.map((i) => ({ slug: i.product_slug, name: i.product_name, image: i.product_image ?? "", price: i.price, qty: i.qty })),
      subtotal: order.subtotal,
      shippingFee: order.shipping_fee,
      total: order.total,
      paymentMethod: "transfer",
    });
  } else if (status === "CANCELLED" || status === "EXPIRED") {
    const { error } = await admin
      .from("orders")
      .update({ payment_status: "cancelled", updated_at: new Date().toISOString() })
      .eq("id", orderCode);
    if (error) {
      console.error("Failed to mark order as cancelled:", error);
      return NextResponse.json({ error: "server_error" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
