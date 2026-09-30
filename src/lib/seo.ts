import type { Metadata } from "next";

// Canonical base URL of the deployed site (no trailing slash). Falls back to
// localhost so local dev still produces valid absolute URLs.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");

export const SITE_NAME = "VERITY GEAR";

// Default social-share image when a page has none of its own.
export const DEFAULT_OG_IMAGE = "/images/hero/hero-main.jpg";

// Maps a locale-agnostic path (always starting with "/", or "/" for home) to
// the real on-site path: vi is unprefixed, en is prefixed with /en — matching
// routing.localePrefix "as-needed".
export function localizedPath(locale: string, path: string): string {
  const clean = path === "/" ? "" : path;
  return locale === "en" ? `/en${clean}` : clean || "/";
}

export function absoluteUrl(locale: string, path: string): string {
  return `${SITE_URL}${localizedPath(locale, path)}`;
}

function toAbsolute(image: string): string {
  if (/^https?:\/\//i.test(image)) return image;
  return `${SITE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
}

type PageMetaInput = {
  locale: string;
  // Canonical path WITHOUT the locale prefix, starting with "/" ("/" = home).
  path: string;
  // Bare title — the layout's title template appends " — VERITY GEAR" for <title>.
  title: string;
  description: string;
  // Absolute (Supabase) or site-relative image paths; first is the OG image.
  images?: (string | null | undefined)[];
  type?: "website" | "article";
  // Set true for pages that must not be indexed (account, checkout, etc.).
  noindex?: boolean;
  publishedTime?: string;
};

export function pageMetadata(input: PageMetaInput): Metadata {
  const { locale, path, title, description, images, type = "website", noindex, publishedTime } = input;
  const url = absoluteUrl(locale, path);
  const cleaned = (images ?? []).filter((i): i is string => !!i && i.trim() !== "");
  const ogImages = (cleaned.length ? cleaned : [DEFAULT_OG_IMAGE]).map(toAbsolute);
  const ogTitle = title === SITE_NAME ? title : `${title} — ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        vi: absoluteUrl("vi", path),
        en: absoluteUrl("en", path),
        "x-default": absoluteUrl("vi", path),
      },
    },
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      title: ogTitle,
      description,
      locale: locale === "en" ? "en_US" : "vi_VN",
      alternateLocale: locale === "en" ? "vi_VN" : "en_US",
      images: ogImages,
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: ogImages,
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
