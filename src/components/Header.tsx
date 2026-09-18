"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/#san-pham", label: "Sản phẩm" },
  { href: "/#danh-muc", label: "Danh mục" },
  { href: "/about", label: "Giới thiệu" },
  { href: "/#lien-he", label: "Liên hệ" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid
          ? "border-b border-ink/10 bg-paper/95 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-18 max-w-[1600px] items-center justify-between px-6 py-4 sm:px-10">
        <Link
          href="/"
          className={`font-display text-xl font-bold tracking-[0.2em] transition-colors duration-500 ${
            solid ? "text-ink" : "text-paper"
          }`}
        >
          VERITY
          <span className={solid ? "text-ink/40" : "text-paper/50"}>GEAR</span>
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

        <div className="flex items-center gap-5">
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

      {open && (
        <nav className="flex flex-col border-t border-ink/10 bg-paper px-6 py-6 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-ink/5 py-4 text-sm font-medium uppercase tracking-[0.12em] text-ink/80"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
