"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SocialLinks from "./SocialLinks";
import SearchOverlay from "./SearchOverlay";
import { useCart } from "./providers/CartProvider";

const NAV_LINKS = [
  { href: "/san-pham", label: "Sản phẩm" },
  { href: "/cot-moc", label: "Cột mốc" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/lien-he", label: "Liên hệ" },
];

const MOBILE_NAV_LINKS = [{ href: "/", label: "Trang chủ" }, ...NAV_LINKS];

// Routes whose first section is a full-bleed dark hero — only these get a
// transparent header at scroll-top. Every other route (e.g. product detail
// pages) starts on a light background, so the header must stay solid.
const HERO_ROUTES = new Set([
  "/",
  "/gioi-thieu",
  "/cot-moc",
  "/lien-he",
  "/san-pham",
  "/tin-tuc",
]);

export default function Header() {
  const pathname = usePathname();
  const hasHero = HERO_ROUTES.has(pathname);
  const { itemCount } = useCart();

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [lang, setLang] = useState<"vi" | "en">("vi");

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

  const solid = !hasHero || scrolled || open;

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid
          ? "border-b border-ink/10 bg-paper/95 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-3 sm:gap-6 sm:px-10 sm:py-4">
        <Link href="/" className="relative inline-block h-12 w-28 shrink-0 sm:h-16 sm:w-38" aria-label="VERITY GEAR">
          <Image
            src="/images/logo/logo-white.png"
            alt="VERITY GEAR"
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
        </Link>

        <nav className="hidden items-center gap-6 md:flex lg:gap-10">
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
          <div
            className={`hidden items-center gap-1.5 text-[12px] font-semibold tracking-[0.06em] transition-colors duration-500 sm:flex ${
              solid ? "text-ink/70" : "text-paper/80"
            }`}
          >
            <button
              type="button"
              onClick={() => setLang("vi")}
              aria-pressed={lang === "vi"}
              className={`transition-opacity ${
                lang === "vi" ? "opacity-100" : "opacity-50 hover:opacity-80"
              }`}
            >
              VI
            </button>
            <span className="opacity-30">/</span>
            <button
              type="button"
              onClick={() => setLang("en")}
              aria-pressed={lang === "en"}
              className={`transition-opacity ${
                lang === "en" ? "opacity-100" : "opacity-50 hover:opacity-80"
              }`}
            >
              EN
            </button>
          </div>
          <button
            aria-label="Tìm kiếm"
            onClick={() => setSearchOpen(true)}
            className={`transition-colors duration-500 ${
              solid ? "text-ink/70 hover:text-ink" : "text-paper/80 hover:text-paper"
            }`}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
          <Link
            href="/gio-hang"
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
            {itemCount > 0 && (
              <span
                className={`absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-semibold transition-colors duration-500 ${
                  solid ? "bg-ink text-paper" : "bg-paper text-ink"
                }`}
              >
                {itemCount}
              </span>
            )}
          </Link>
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
      className={`fixed inset-x-0 top-18 bottom-0 z-40 flex flex-col justify-between bg-paper px-6 py-8 transition-opacity duration-300 sm:top-24 md:hidden ${
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
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-ink">
          <button
            type="button"
            onClick={() => setLang("vi")}
            aria-pressed={lang === "vi"}
            className={lang === "vi" ? "opacity-100" : "opacity-40"}
          >
            Tiếng Việt
          </button>
          <span className="opacity-30">/</span>
          <button
            type="button"
            onClick={() => setLang("en")}
            aria-pressed={lang === "en"}
            className={lang === "en" ? "opacity-100" : "opacity-40"}
          >
            English
          </button>
        </div>
        <SocialLinks variant="light" />
      </div>
    </nav>

    <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
