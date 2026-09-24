import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["vi", "en"],
  defaultLocale: "vi",
  // Vietnamese (default) stays unprefixed (/san-pham), English is prefixed
  // (/en/san-pham) — preserves the site's existing indexed URLs.
  localePrefix: "as-needed",
});
