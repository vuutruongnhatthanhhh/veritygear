"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";

const inputClass =
  "w-full border border-ink/15 bg-ink/[0.03] px-4 py-3.5 text-[14px] text-ink placeholder:text-ink/35 outline-none transition-colors focus:border-ink";

export default function QuenMatKhauPage() {
  const t = useTranslations("auth.forgotPassword");
  const tAccount = useTranslations("account");
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string).trim();

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok && res.status === 429) {
        setError(t("errorRateLimited"));
        setSubmitting(false);
      } else {
        router.push(`/dat-lai-mat-khau?email=${encodeURIComponent(email)}`);
      }
    } catch {
      setError(t("errorServer"));
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-[75vh] max-w-md flex-col justify-center px-6 py-32">
      <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.35em] text-ink">
        {tAccount("eyebrow")}
      </p>
      <h1 className="mb-3 text-center font-display text-3xl font-bold uppercase leading-tight sm:text-4xl">
        {t("heading")}
      </h1>
      <p className="mb-8 text-center text-[14px] text-ink/60">{t("description")}</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="border border-red-300 bg-red-50 px-4 py-3 text-[13px] text-red-700">{error}</div>
        )}
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-ink/60">
            {t("emailLabel")}
          </label>
          <input required name="email" type="email" autoComplete="email" placeholder="ban@email.com" className={inputClass} />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-13 w-full items-center justify-center bg-ink text-[13px] font-semibold uppercase tracking-[0.14em] text-paper transition-transform hover:scale-[1.01] disabled:opacity-60"
        >
          {submitting ? t("submitting") : t("submit")}
        </button>
      </form>

      <p className="mt-6 text-center text-[13px]">
        <Link href="/dang-nhap" className="text-ink/60 underline underline-offset-4 hover:text-ink">
          {t("backToLogin")}
        </Link>
      </p>
    </section>
  );
}
