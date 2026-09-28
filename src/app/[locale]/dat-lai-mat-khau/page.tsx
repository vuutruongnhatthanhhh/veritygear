"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full border border-ink/15 bg-ink/[0.03] px-4 py-3.5 text-[14px] text-ink placeholder:text-ink/35 outline-none transition-colors focus:border-ink";

export default function DatLaiMatKhauPage() {
  const t = useTranslations("auth.resetPassword");
  const tAccount = useTranslations("account");
  const router = useRouter();
  const supabase = createClient();

  const [checking, setChecking] = useState(true);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setHasRecoverySession(true);
    });

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setHasRecoverySession(true);
      setChecking(false);
    });

    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError(t("errorMismatch"));
      return;
    }
    if (password.length < 6) {
      setError(t("errorTooShort"));
      return;
    }

    setSubmitting(true);
    setError(null);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/tai-khoan"), 1200);
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

      {success ? (
        <div className="border border-ink/15 bg-ink/[0.03] p-8 text-center">
          <p className="font-display text-lg font-bold uppercase">{t("successHeading")}</p>
          <p className="mt-2 text-[14px] text-ink/60">{t("successBody")}</p>
        </div>
      ) : checking ? (
        <p className="text-center text-[14px] text-ink/60">{t("checking")}</p>
      ) : !hasRecoverySession ? (
        <div className="space-y-4 text-center">
          <p className="text-[14px] text-ink/60">{t("invalidLink")}</p>
          <Link href="/quen-mat-khau" className="text-[13px] font-semibold text-ink underline underline-offset-4">
            {t("requestNewLink")}
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="border border-red-300 bg-red-50 px-4 py-3 text-[13px] text-red-700">{error}</div>
          )}
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-ink/60">
              {t("newPasswordLabel")}
            </label>
            <input required name="password" type="password" autoComplete="new-password" placeholder="••••••••" className={inputClass} />
          </div>
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-ink/60">
              {t("confirmPasswordLabel")}
            </label>
            <input
              required
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-13 w-full items-center justify-center bg-ink text-[13px] font-semibold uppercase tracking-[0.14em] text-paper transition-transform hover:scale-[1.01] disabled:opacity-60"
          >
            {submitting ? t("submitting") : t("submit")}
          </button>
        </form>
      )}
    </section>
  );
}
