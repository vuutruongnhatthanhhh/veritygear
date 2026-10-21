import { createAdminClient } from "@/lib/supabase/admin";
import { getTransporter, hasSmtpConfig, getMailFrom, emailLayout, emailButtonHtml } from "@/lib/mailer";
import { formatVnd } from "@/lib/format";

type CartItemInput = { slug: string; name: string; image: string; price: number; qty: number };

export type NewOrderEmailFields = {
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
  paymentMethod: "cod" | "transfer";
  currency: "VND" | "USD";
  exchangeRate: number | null;
};

function fullAddress(o: NewOrderEmailFields): string {
  return [o.address, o.wardName, o.districtName, o.city].filter(Boolean).join(", ");
}

function paymentLabel(method: "cod" | "transfer"): string {
  return method === "transfer" ? "Bank transfer (paid via PayOS)" : "Cash on delivery (COD)";
}

// Amount actually charged is always VND — always show the USD equivalent
// alongside it too (using the rate snapshotted at order time), regardless of
// which currency the customer was viewing at checkout.
function formatAmount(o: NewOrderEmailFields, amountVnd: number): string {
  const vnd = formatVnd(amountVnd);
  if (!o.exchangeRate) return vnd;
  const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amountVnd / o.exchangeRate);
  return `${vnd} (~${usd})`;
}

function newOrderEmailHtml(o: NewOrderEmailFields) {
  const itemRows = o.items
    .map(
      (i) =>
        `<p style="color:#444; line-height:1.6; margin:4px 0;">${i.name} × ${i.qty} — ${formatAmount(o, i.price * i.qty)}</p>`,
    )
    .join("");

  return emailLayout(`
    <h2 style="margin:0 0 12px; font-size: 20px;">New order: ${o.orderCode}</h2>
    <p style="color:#444; line-height:1.6;"><strong>Customer:</strong> ${o.fullName}</p>
    <p style="color:#444; line-height:1.6;"><strong>Phone:</strong> ${o.phone}</p>
    <p style="color:#444; line-height:1.6;"><strong>Email:</strong> ${o.email}</p>
    <p style="color:#444; line-height:1.6;"><strong>Address:</strong> ${fullAddress(o)}</p>
    ${o.note ? `<p style="color:#444; line-height:1.6;"><strong>Note:</strong> ${o.note}</p>` : ""}
    <p style="color:#444; line-height:1.6;"><strong>Payment:</strong> ${paymentLabel(o.paymentMethod)}</p>
    ${o.exchangeRate ? `<p style="color:#444; line-height:1.6;"><strong>Exchange rate:</strong> 1 USD = ${formatVnd(o.exchangeRate)}${o.currency === "USD" ? " (customer was viewing prices in USD at checkout)" : ""}. Amount charged is always VND — USD equivalent shown in parentheses below.</p>` : ""}
    <hr style="border:none; border-top:1px solid #eee; margin:20px 0;" />
    ${itemRows}
    <p style="color:#444; line-height:1.6; margin-top:16px;">Subtotal: ${formatAmount(o, o.subtotal)}</p>
    <p style="color:#444; line-height:1.6;">Shipping: ${o.shippingFee === 0 ? "Free" : formatAmount(o, o.shippingFee)}</p>
    <p style="color:#0A0A0A; line-height:1.6; font-weight:700;">Total: ${formatAmount(o, o.total)}</p>
    ${emailButtonHtml(`mailto:${o.email}`, "CONTACT CUSTOMER")}
  `);
}

function newOrderEmailText(o: NewOrderEmailFields) {
  const itemLines = o.items.map((i) => `${i.name} x${i.qty} - ${formatAmount(o, i.price * i.qty)}`).join("\n");
  return `New order: ${o.orderCode}\n\nCustomer: ${o.fullName}\nPhone: ${o.phone}\nEmail: ${o.email}\nAddress: ${fullAddress(o)}${
    o.note ? `\nNote: ${o.note}` : ""
  }\nPayment: ${paymentLabel(o.paymentMethod)}${
    o.exchangeRate
      ? `\nExchange rate: 1 USD = ${formatVnd(o.exchangeRate)}${o.currency === "USD" ? " (customer was viewing prices in USD at checkout)" : ""} — amount charged is always VND, USD equivalent in parentheses`
      : ""
  }\n\n${itemLines}\n\nSubtotal: ${formatAmount(o, o.subtotal)}\nShipping: ${
    o.shippingFee === 0 ? "Free" : formatAmount(o, o.shippingFee)
  }\nTotal: ${formatAmount(o, o.total)}`;
}

export async function sendNewOrderNotification(fields: NewOrderEmailFields) {
  if (!hasSmtpConfig()) return;

  try {
    const admin = createAdminClient();
    const { data: settings } = await admin.from("contact_settings").select("recipient_email").eq("id", 1).single();
    const recipientEmail = settings?.recipient_email;
    if (!recipientEmail) return;

    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"VERITY GEAR" <${getMailFrom()}>`,
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
