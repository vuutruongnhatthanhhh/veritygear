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
};

function fullAddress(o: NewOrderEmailFields): string {
  return [o.address, o.wardName, o.districtName, o.city].filter(Boolean).join(", ");
}

function paymentLabel(method: "cod" | "transfer"): string {
  return method === "transfer" ? "Chuyển khoản ngân hàng (đã thanh toán qua PayOS)" : "Khi nhận hàng (COD)";
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
    <p style="color:#444; line-height:1.6;"><strong>Thanh toán:</strong> ${paymentLabel(o.paymentMethod)}</p>
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
  }\nThanh toán: ${paymentLabel(o.paymentMethod)}\n\n${itemLines}\n\nTạm tính: ${formatVnd(o.subtotal)}\nVận chuyển: ${
    o.shippingFee === 0 ? "Miễn phí" : formatVnd(o.shippingFee)
  }\nTổng cộng: ${formatVnd(o.total)}`;
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
