"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/#san-pham", label: "Sản phẩm" },
  { href: "/cot-moc", label: "Cột mốc" },
  { href: "/about", label: "Giới thiệu" },
  { href: "/lien-he", label: "Liên hệ" },
];

const MOBILE_NAV_LINKS = [{ href: "/", label: "Trang chủ" }, ...NAV_LINKS];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid
          ? "border-b border-ink/10 bg-paper/95 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-3 px-4 py-3 sm:h-18 sm:gap-6 sm:px-10 sm:py-4">
        <Link href="/" className="flex min-w-0 shrink items-center gap-2 sm:shrink-0 sm:gap-3" aria-label="VERITY GEAR">
          <span className="relative inline-block h-7 w-16.5 shrink-0 sm:h-11 sm:w-26">
            <Image
              src="/images/logo/logo-white.png"
              alt=""
              width={236}
              height={100}
              priority
              className={`h-full w-full object-contain transition-opacity duration-500 ${
                solid ? "opacity-0" : "opacity-100"
              }`}
            />
            <Image
              src="/images/logo/logo-dark.png"
              alt=""
              aria-hidden="true"
              width={236}
              height={100}
              priority
              className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ${
                solid ? "opacity-100" : "opacity-0"
              }`}
            />
          </span>
          <span
            className={`truncate font-display text-base font-bold tracking-[0.12em] transition-colors duration-500 sm:text-2xl sm:tracking-[0.2em] ${
              solid ? "text-ink" : "text-paper"
            }`}
          >
            VERITY<span className={solid ? "text-ink/40" : "text-paper/50"}>GEAR</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[13px] font-medium uppercase tracking-[0.12em] transition-colors duration-500 ${
                solid ? "text-ink/70 hover:text-ink" : "text-paper/80 hover:text-paper"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3 sm:gap-5">
          <button
            aria-label="Tìm kiếm"
            className={`hidden transition-colors duration-500 sm:block ${
              solid ? "text-ink/70 hover:text-ink" : "text-paper/80 hover:text-paper"
            }`}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
          <button
            aria-label="Giỏ hàng"
            className={`relative transition-colors duration-500 ${
              solid ? "text-ink/70 hover:text-ink" : "text-paper/80 hover:text-paper"
            }`}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span
              className={`absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-semibold transition-colors duration-500 ${
                solid ? "bg-ink text-paper" : "bg-paper text-ink"
              }`}
            >
              0
            </span>
          </button>
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="flex flex-col gap-[5px] md:hidden"
          >
            <span
              className={`h-[1.5px] w-6 transition-transform duration-500 ${
                solid ? "bg-ink" : "bg-paper"
              } ${open ? "translate-y-[3.25px] rotate-45" : ""}`}
            />
            <span
              className={`h-[1.5px] w-6 transition-opacity duration-500 ${
                solid ? "bg-ink" : "bg-paper"
              } ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`h-[1.5px] w-6 transition-transform duration-500 ${
                solid ? "bg-ink" : "bg-paper"
              } ${open ? "-translate-y-[3.25px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>
    </header>

    <nav
      className={`fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col justify-between bg-paper px-6 py-8 transition-opacity duration-300 sm:top-18 md:hidden ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="flex flex-col">
        {MOBILE_NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="border-b border-ink/10 py-5 font-display text-2xl font-bold uppercase tracking-wide text-ink"
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div className="flex gap-4">
        {["Facebook", "Instagram", "TikTok", "YouTube"].map((s) => (
          <a
            key={s}
            href="#"
            aria-label={s}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 text-[10px] font-semibold uppercase tracking-wide text-ink/70"
          >
            {s.slice(0, 2)}
          </a>
        ))}
      </div>
    </nav>
    </>
  );
}
