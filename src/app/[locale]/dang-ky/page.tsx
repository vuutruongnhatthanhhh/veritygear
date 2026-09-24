"use client";

import { useState, type FormEvent } from "react";
import { Link } from "@/i18n/navigation";

const inputClass =
  "w-full border border-ink/15 bg-ink/[0.03] px-4 py-3.5 text-[14px] text-ink placeholder:text-ink/35 outline-none transition-colors focus:border-ink";

const ERROR_MESSAGES: Record<string, string> = {
  invalid_input: "Vui lòng nhập đầy đủ thông tin (mật khẩu tối thiểu 6 ký tự).",
  already_registered: "Email này đã được đăng ký. Hãy đăng nhập hoặc quên mật khẩu.",
  rate_limited: "Bạn đã thử quá nhiều lần, vui lòng thử lại sau.",
  send_failed: "Không gửi được email xác nhận, vui lòng thử lại.",
  server_error: "Có lỗi xảy ra, vui lòng thử lại.",
};

export default function DangKyPage() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fullName = (formData.get("fullName") as string).trim();
    const email = (formData.get("email") as string).trim();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(ERROR_MESSAGES[data.error] ?? ERROR_MESSAGES.server_error);
        return;
      }
      setSent(true);
    } catch {
      setError(ERROR_MESSAGES.server_error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-[75vh] max-w-md flex-col justify-center px-6 py-32">
      <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.35em] text-ink">
        Tài khoản
      </p>
      <h1 className="mb-8 text-center font-display text-3xl font-bold uppercase leading-tight sm:text-4xl">
        Đăng ký
      </h1>

      {sent ? (
        <div className="border border-ink/15 bg-ink/[0.03] p-8 text-center">
          <p className="font-display text-lg font-bold uppercase">Kiểm tra email của bạn</p>
          <p className="mt-2 text-[14px] text-ink/60">
            Chúng tôi đã gửi liên kết xác nhận tài khoản. Vui lòng kiểm tra hộp thư đến (và cả thư mục Spam).
          </p>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-5 border border-red-300 bg-red-50 px-4 py-3 text-[13px] text-red-700">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-ink/60">
                Họ và tên
              </label>
              <input required name="fullName" type="text" placeholder="Nguyễn Văn A" className={inputClass} />
            </div>
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
              <input required name="password" type="password" autoComplete="new-password" placeholder="••••••••" className={inputClass} />
            </div>
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-ink/60">
                Xác nhận mật khẩu
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
              {submitting ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </form>
        </>
      )}

      <p className="mt-6 text-center text-[13px] text-ink/60">
        Đã có tài khoản?{" "}
        <Link href="/dang-nhap" className="font-semibold text-ink underline underline-offset-4">
          Đăng nhập
        </Link>
      </p>
    </section>
  );
}
