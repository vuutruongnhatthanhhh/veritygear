// Single source of truth for "canonical path -> English public path".
// Canonical paths are the Vietnamese, folder-based routes (e.g. "/san-pham")
// — these never change, since the actual app/[locale]/... file structure
// stays in Vietnamese regardless of locale. Only the PUBLIC URL shown to
// English visitors differs.
//
// Consumed by:
// - src/i18n/routing.ts — next-intl's `pathnames` config (drives Link/
//   useRouter/redirect translation and the middleware's URL rewriting).
// - src/lib/seo.ts — canonical/hreflang/OG URLs and sitemap.xml generation.
// - src/proxy.ts — normalizes an incoming request's public pathname back to
//   its canonical form before matching route-prefix checks (e.g. the
//   /tai-khoan auth guard), since the English /account path must still be
//   recognized as needing a logged-in user.
//
// Keep this in sync with the `pathnames` config in src/i18n/routing.ts (kept
// as a separate literal object there, not derived from this array, because
// next-intl's typed Link/useRouter need TypeScript to see literal string
// keys — spreading a programmatically-built object collapses them to a
// generic `string` and silently breaks the typed navigation).
//
// Order doesn't matter here — translate() always matches the longest prefix
// first so a child route (e.g. "/tai-khoan/don-hang") is never shadowed by
// its parent ("/tai-khoan").
export const EN_PATH_PREFIXES: ReadonlyArray<readonly [string, string]> = [
  ["/san-pham", "/products"],
  ["/tin-tuc", "/news"],
  ["/gioi-thieu", "/about"],
  ["/cot-moc", "/milestones"],
  ["/lien-he", "/contact"],
  ["/gio-hang", "/cart"],
  ["/thanh-toan/ket-qua", "/checkout/result"],
  ["/thanh-toan", "/checkout"],
  ["/dang-nhap", "/login"],
  ["/dang-ky", "/register"],
  ["/quen-mat-khau", "/forgot-password"],
  ["/dat-lai-mat-khau", "/reset-password"],
  ["/tai-khoan/don-hang", "/account/orders"],
  ["/tai-khoan", "/account"],
];

const byLengthDesc = [...EN_PATH_PREFIXES].sort((a, b) => b[0].length - a[0].length);

function translate(path: string, fromIndex: 0 | 1, toIndex: 0 | 1): string {
  if (path === "" || path === "/") return path;
  for (const pair of byLengthDesc) {
    const from = pair[fromIndex];
    const to = pair[toIndex];
    if (path === from) return to;
    if (path.startsWith(`${from}/`)) return to + path.slice(from.length);
  }
  // Unknown path (e.g. an admin-managed custom page slug) — left untranslated.
  return path;
}

/** Canonical path ("/san-pham/vrt-x1") -> English public path ("/products/vrt-x1"). */
export function toEnglishPath(path: string): string {
  return translate(path, 0, 1);
}

/** English public path ("/products/vrt-x1") -> canonical path ("/san-pham/vrt-x1"). */
export function toCanonicalPath(path: string): string {
  return translate(path, 1, 0);
}
