"use client";

import { useState, type FormEvent } from "react";

const inputClass =
  "w-full border border-ink/15 bg-ink/[0.03] px-4 py-3.5 text-[14px] text-ink placeholder:text-ink/35 outline-none transition-colors focus:border-ink";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 700);
  }

  return (
    <div>
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-ink/40">
        Gửi tin nhắn
      </p>
      <h2 className="mb-3 font-display text-3xl font-bold uppercase leading-tight sm:text-4xl">
        Chúng tôi lắng nghe bạn
      </h2>
      <p className="mb-8 max-w-md text-[15px] leading-relaxed text-ink/60">
        Điền thông tin bên dưới, đội ngũ của chúng tôi sẽ phản hồi trong vòng
        24 giờ làm việc.
      </p>

      {status === "sent" ? (
        <div className="border border-ink/15 bg-ink/[0.03] p-8">
          <p className="font-display text-lg font-bold uppercase">
            Đã gửi tin nhắn!
          </p>
          <p className="mt-2 text-[14px] text-ink/60">
            Cảm ơn bạn đã liên hệ. VERITY GEAR sẽ phản hồi qua email trong
            thời gian sớm nhất.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-5 text-[13px] font-semibold uppercase tracking-[0.12em] underline underline-offset-4"
          >
            Gửi tin nhắn khác
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-ink/60">
                Họ và tên
              </label>
              <input required name="name" type="text" placeholder="Nguyễn Văn A" className={inputClass} />
            </div>
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-ink/60">
                Email
              </label>
              <input required name="email" type="email" placeholder="ban@email.com" className={inputClass} />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-ink/60">
                Điện thoại
              </label>
              <input name="phone" type="tel" placeholder="0912 345 678" className={inputClass} />
            </div>
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-ink/60">
                Chủ đề
              </label>
              <input name="subject" type="text" placeholder="Bạn cần hỗ trợ về vấn đề gì?" className={inputClass} />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-ink/60">
              Nội dung
            </label>
            <textarea
              required
              name="message"
              rows={5}
              placeholder="Nhập nội dung tin nhắn của bạn..."
              className={`${inputClass} resize-none`}
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex h-13 items-center justify-center gap-3 bg-ink px-9 text-[13px] font-semibold uppercase tracking-[0.14em] text-paper transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {status === "sending" ? "Đang gửi..." : "Gửi tin nhắn"}
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
