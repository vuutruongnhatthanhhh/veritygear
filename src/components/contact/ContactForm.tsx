"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

const inputClass =
  "w-full border border-ink/15 bg-ink/[0.03] px-4 py-3.5 text-[14px] text-ink placeholder:text-ink/35 outline-none transition-colors focus:border-ink";

export default function ContactForm() {
  const t = useTranslations("contactForm");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setStatus("error");
        return;
      }
      setStatus("sent");
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-ink">{t("eyebrow")}</p>
      <h2 className="mb-3 font-display text-3xl font-bold uppercase leading-tight sm:text-4xl">{t("heading")}</h2>
      <p className="mb-8 max-w-md text-[15px] leading-relaxed text-ink">{t("description")}</p>

      {status === "sent" ? (
        <div className="border border-ink/15 bg-ink/[0.03] p-8">
          <p className="font-display text-lg font-bold uppercase">{t("sentTitle")}</p>
          <p className="mt-2 text-[14px] text-ink/60">{t("sentBody")}</p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-5 text-[13px] font-semibold uppercase tracking-[0.12em] underline underline-offset-4"
          >
            {t("sendAnother")}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {status === "error" && (
            <div className="border border-red-300 bg-red-50 px-4 py-3 text-[13px] text-red-700">{t("error")}</div>
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-ink">
                {t("nameLabel")}
              </label>
              <input required name="name" type="text" placeholder="Nguyễn Văn A" className={inputClass} />
            </div>
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-ink">
                {t("emailLabel")}
              </label>
              <input required name="email" type="email" placeholder="ban@email.com" className={inputClass} />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-ink">
                {t("phoneLabel")}
              </label>
              <input name="phone" type="tel" placeholder="0912 345 678" className={inputClass} />
            </div>
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-ink">
                {t("subjectLabel")}
              </label>
              <input name="subject" type="text" placeholder={t("subjectPlaceholder")} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-ink">
              {t("messageLabel")}
            </label>
            <textarea
              required
              name="message"
              rows={5}
              placeholder={t("messagePlaceholder")}
              className={`${inputClass} resize-none`}
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex h-13 items-center justify-center gap-3 bg-ink px-9 text-[13px] font-semibold uppercase tracking-[0.14em] text-paper transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {status === "sending" ? t("submitting") : t("submit")}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
        </form>
      )}
    </div>
  );
}
