"use client";

import { useState, type FormEvent } from "react";
import { Link } from "@/i18n/navigation";

const inputClass =
  "w-full border border-ink/15 bg-ink/[0.03] px-4 py-3.5 text-[14px] text-ink placeholder:text-ink/35 outline-none transition-colors focus:border-ink";

export default function QuenMatKhauPage() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
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
        setError("Bạn đã thử quá nhiều lần, vui lòng thử lại sau.");
      } else {
        setSent(true);
      }
    } catch {
      setError("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-[75vh] max-w-md flex-col justify-center px-6 py-32">
      <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.35em] text-ink">
        Tài khoản
      </p>
      <h1 className="mb-3 text-center font-display text-3xl font-bold uppercase leading-tight sm:text-4xl">
        Quên mật khẩu
      </h1>
      <p className="mb-8 text-center text-[14px] text-ink/60">
        Nhập email đã đăng ký, chúng tôi sẽ gửi liên kết đặt lại mật khẩu.
      </p>

      {sent ? (
        <div className="border border-ink/15 bg-ink/[0.03] p-8 text-center">
          <p className="font-display text-lg font-bold uppercase">Đã gửi liên kết</p>
          <p className="mt-2 text-[14px] text-ink/60">
            Nếu email tồn tại trong hệ thống, một liên kết đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư
            đến (và cả thư mục Spam).
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="border border-red-300 bg-red-50 px-4 py-3 text-[13px] text-red-700">{error}</div>
          )}
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-ink/60">
              Email
            </label>
            <input required name="email" type="email" autoComplete="email" placeholder="ban@email.com" className={inputClass} />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-13 w-full items-center justify-center bg-ink text-[13px] font-semibold uppercase tracking-[0.14em] text-paper transition-transform hover:scale-[1.01] disabled:opacity-60"
          >
            {submitting ? "Đang gửi..." : "Gửi liên kết đặt lại"}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-[13px]">
        <Link href="/dang-nhap" className="text-ink/60 underline underline-offset-4 hover:text-ink">
          ← Quay lại đăng nhập
        </Link>
      </p>
    </section>
  );
}
