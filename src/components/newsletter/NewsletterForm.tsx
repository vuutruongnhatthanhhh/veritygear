"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export function NewsletterForm({
  eyebrow,
  heading,
  body,
  subscribedLabel,
  placeholder,
  submitLabel,
  submittingLabel,
  errorLabel,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  subscribedLabel: string;
  placeholder: string;
  submitLabel: string;
  submittingLabel: string;
  errorLabel: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [email, setEmail] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const supabase = createClient();
    const { error } = await supabase.from("home_newsletter_subscribers").insert({ email });

    if (error) {
      // Unique violation just means they're already subscribed — treat as success.
      setStatus(error.code === "23505" ? "sent" : "error");
      return;
    }

    setStatus("sent");
    setEmail("");
  }

  return (
    <section className="bg-ink py-24 sm:py-32">
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 text-center">
        <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-paper/50">{eyebrow}</p>
        <h2 className="font-display text-3xl font-bold uppercase leading-[1.1] text-paper sm:text-4xl">
          {heading}
        </h2>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-paper/60">{body}</p>

        {status === "sent" ? (
          <p className="mt-8 text-sm font-medium text-paper">{subscribedLabel}</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              className="h-13 w-full border border-paper/25 bg-transparent px-5 text-sm text-paper placeholder:text-paper/40 focus:border-paper focus:outline-none sm:flex-1"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="h-13 shrink-0 bg-paper px-7 text-[13px] font-semibold uppercase tracking-[0.14em] text-ink transition-transform hover:scale-[1.03] disabled:opacity-60"
            >
              {status === "sending" ? submittingLabel : submitLabel}
            </button>
          </form>
        )}
        {status === "error" && <p className="mt-4 text-sm text-red-300">{errorLabel}</p>}
      </div>
    </section>
  );
}
