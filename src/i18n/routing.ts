import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["vi", "en"],
  defaultLocale: "vi",
  // Vietnamese (default) stays unprefixed (/san-pham), English is prefixed
  // (/en/san-pham) — preserves the site's existing indexed URLs.
  localePrefix: "as-needed",
  // Don't auto-redirect based on the browser's Accept-Language header —
  // always serve vi at "/" regardless of visitor locale (and so Googlebot
  // consistently indexes the same locale at each URL instead of getting
  // bounced between vi/en on repeat crawls).
  localeDetection: false,
});
