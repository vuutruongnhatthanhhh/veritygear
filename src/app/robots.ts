import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private / transactional areas — no SEO value, keep out of the index.
      // Covers both the default (vi) and the /en-prefixed variants.
      disallow: [
        "/api/",
        "/tai-khoan",
        "/en/tai-khoan",
        "/thanh-toan",
        "/en/thanh-toan",
        "/gio-hang",
        "/en/gio-hang",
        "/dang-nhap",
        "/en/dang-nhap",
        "/dang-ky",
        "/en/dang-ky",
        "/quen-mat-khau",
        "/en/quen-mat-khau",
        "/dat-lai-mat-khau",
        "/en/dat-lai-mat-khau",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
