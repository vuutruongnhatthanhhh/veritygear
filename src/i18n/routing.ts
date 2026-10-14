import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["vi", "en"],
  defaultLocale: "vi",
  // Vietnamese (default) stays unprefixed (/san-pham), English is prefixed
  // (/en/products) — preserves the site's existing indexed Vietnamese URLs.
  localePrefix: "as-needed",
  // Don't auto-redirect based on the browser's Accept-Language header —
  // always serve vi at "/" regardless of visitor locale (and so Googlebot
  // consistently indexes the same locale at each URL instead of getting
  // bounced between vi/en on repeat crawls).
  localeDetection: false,
  // English gets its own translated URL per section (e.g. /en/products
  // instead of /en/san-pham) — the keys here are the canonical, Vietnamese
  // folder-based routes (app/[locale]/san-pham/...) and never change; only
  // the English value differs. Admin-managed custom pages ("/[slug]") are
  // intentionally left untranslated — their slugs are arbitrary, DB-driven
  // content, not fixed app routes.
  //
  // Written out as a literal object (not derived via Object.fromEntries from
  // src/lib/localizedPaths.ts) on purpose: next-intl's typed Link/useRouter
  // only recognize pathnames whose keys TypeScript can see as string literals
  // — spreading in a programmatically-built object collapses those keys to
  // a generic `string`, silently breaking the typed navigation everywhere.
  //
  // `vi` is always spelled out explicitly (not omitted/"defaulted to the
  // key") — next-intl's middleware only recognizes a locale variant that's
  // an actual key in this object when matching an incoming request. Omitting
  // `vi` here caused single-segment Vietnamese URLs (e.g. "/san-pham") to be
  // mismatched against the generic "/[slug]" custom-page route instead of
  // their own entry, since that's the only one directly comparable to the
  // raw pathname — confirmed by testing "/en/san-pham" locally and finding
  // it served content directly (200) instead of redirecting to the correct
  // "/en/products" like every other misspelled old English URL does.
  pathnames: {
    "/": "/",
    "/[slug]": "/[slug]",
    "/san-pham": { vi: "/san-pham", en: "/products" },
    "/san-pham/[slug]": { vi: "/san-pham/[slug]", en: "/products/[slug]" },
    "/tin-tuc": { vi: "/tin-tuc", en: "/news" },
    "/tin-tuc/[slug]": { vi: "/tin-tuc/[slug]", en: "/news/[slug]" },
    "/gioi-thieu": { vi: "/gioi-thieu", en: "/about" },
    "/cot-moc": { vi: "/cot-moc", en: "/milestones" },
    "/lien-he": { vi: "/lien-he", en: "/contact" },
    "/gio-hang": { vi: "/gio-hang", en: "/cart" },
    "/thanh-toan": { vi: "/thanh-toan", en: "/checkout" },
    "/thanh-toan/ket-qua": { vi: "/thanh-toan/ket-qua", en: "/checkout/result" },
    "/dang-nhap": { vi: "/dang-nhap", en: "/login" },
    "/dang-ky": { vi: "/dang-ky", en: "/register" },
    "/quen-mat-khau": { vi: "/quen-mat-khau", en: "/forgot-password" },
    "/dat-lai-mat-khau": { vi: "/dat-lai-mat-khau", en: "/reset-password" },
    "/tai-khoan": { vi: "/tai-khoan", en: "/account" },
    "/tai-khoan/don-hang": { vi: "/tai-khoan/don-hang", en: "/account/orders" },
    "/tai-khoan/don-hang/[code]": { vi: "/tai-khoan/don-hang/[code]", en: "/account/orders/[code]" },
  },
});
