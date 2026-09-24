"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full border border-ink/15 bg-ink/[0.03] px-4 py-3.5 text-[14px] text-ink placeholder:text-ink/35 outline-none transition-colors focus:border-ink";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string).trim();
    const password = formData.get("password") as string;

    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);

    if (error) {
      setError("Email hoặc mật khẩu không đúng");
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <section className="mx-auto flex min-h-[75vh] max-w-md flex-col justify-center px-6 py-32">
      <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.35em] text-ink">
        Tài khoản
      </p>
      <h1 className="mb-8 text-center font-display text-3xl font-bold uppercase leading-tight sm:text-4xl">
        Đăng nhập
      </h1>

      {error && (
        <div className="mb-5 border border-red-300 bg-red-50 px-4 py-3 text-[13px] text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-ink/60">
            Email
          </label>
          <input required name="email" type="email" autoComplete="email" placeholder="ban@email.com" className={inputClass} />
        </div>
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-ink/60">
            Mật khẩu
          </label>
          <input
            required
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-13 w-full items-center justify-center bg-ink text-[13px] font-semibold uppercase tracking-[0.14em] text-paper transition-transform hover:scale-[1.01] disabled:opacity-60"
        >
          {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      <div className="mt-6 flex flex-col items-center gap-2 text-[13px]">
        <Link href="/quen-mat-khau" className="text-ink/60 underline underline-offset-4 hover:text-ink">
          Quên mật khẩu?
        </Link>
        <p className="text-ink/60">
          Chưa có tài khoản?{" "}
          <Link href="/dang-ky" className="font-semibold text-ink underline underline-offset-4">
            Đăng ký
          </Link>
        </p>
      </div>
    </section>
  );
}
