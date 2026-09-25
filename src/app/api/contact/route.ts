import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTransporter, hasSmtpConfig, emailLayout, emailButtonHtml } from "@/lib/mailer";
import { isRateLimited, getClientIp } from "@/lib/rateLimit";

function contactEmailHtml(fields: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  return emailLayout(`
    <h2 style="margin:0 0 12px; font-size: 20px;">Tin nhắn liên hệ mới</h2>
    <p style="color:#444; line-height:1.6;"><strong>Họ tên:</strong> ${fields.name}</p>
    <p style="color:#444; line-height:1.6;"><strong>Email:</strong> ${fields.email}</p>
    ${fields.phone ? `<p style="color:#444; line-height:1.6;"><strong>Điện thoại:</strong> ${fields.phone}</p>` : ""}
    ${fields.subject ? `<p style="color:#444; line-height:1.6;"><strong>Chủ đề:</strong> ${fields.subject}</p>` : ""}
    <p style="color:#444; line-height:1.6; white-space:pre-line;">${fields.message}</p>
    ${emailButtonHtml(`mailto:${fields.email}`, "TRẢ LỜI KHÁCH HÀNG")}
  `);
}

function contactEmailText(fields: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  return `Tin nhắn liên hệ mới\n\nHọ tên: ${fields.name}\nEmail: ${fields.email}${
    fields.phone ? `\nĐiện thoại: ${fields.phone}` : ""
  }${fields.subject ? `\nChủ đề: ${fields.subject}` : ""}\n\n${fields.message}`;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (isRateLimited(`contact:${ip}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: { name?: string; email?: string; phone?: string; subject?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const subject = (body.subject ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  if (!hasSmtpConfig()) {
    return NextResponse.json({ error: "send_failed" }, { status: 500 });
  }

  const admin = createAdminClient();
  const { data: settings } = await admin.from("contact_settings").select("recipient_email").eq("id", 1).single();
  const recipientEmail = settings?.recipient_email;

  if (!recipientEmail) {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"VERITY GEAR" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      replyTo: email,
      subject: `Tin nhắn liên hệ mới${subject ? `: ${subject}` : ""}`,
      text: contactEmailText({ name, email, phone, subject, message }),
      html: contactEmailHtml({ name, email, phone, subject, message }),
    });
  } catch (err) {
    console.error("Failed to send contact email:", err);
    return NextResponse.json({ error: "send_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
