import { createClient } from "@supabase/supabase-js";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

function publicClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  });
}

function xmlEscape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

type Entry = { path: string; lastmod?: string; changefreq?: string; priority?: number };

function urlBlock(e: Entry): string {
  const vi = absoluteUrl("vi", e.path);
  const en = absoluteUrl("en", e.path);
  return [
    "  <url>",
    `    <loc>${xmlEscape(vi)}</loc>`,
    `    <xhtml:link rel="alternate" hreflang="vi" href="${xmlEscape(vi)}" />`,
    `    <xhtml:link rel="alternate" hreflang="en" href="${xmlEscape(en)}" />`,
    e.lastmod ? `    <lastmod>${xmlEscape(e.lastmod)}</lastmod>` : "",
    e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : "",
    e.priority !== undefined ? `    <priority>${e.priority}</priority>` : "",
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function GET() {
  const supabase = publicClient();
  const [{ data: products }, { data: articles }, { data: pages }] = await Promise.all([
    supabase.from("products").select("slug, updated_at").eq("is_active", true),
    supabase.from("news_articles").select("slug, updated_at").eq("is_active", true),
    supabase.from("custom_pages").select("slug, updated_at").eq("is_active", true),
  ]);

  const iso = (v?: string | null) => (v ? new Date(v).toISOString() : undefined);

  const entries: Entry[] = [
    { path: "/", changefreq: "weekly", priority: 1 },
    { path: "/san-pham", changefreq: "daily", priority: 0.9 },
    { path: "/tin-tuc", changefreq: "daily", priority: 0.7 },
    { path: "/gioi-thieu", changefreq: "monthly", priority: 0.5 },
    { path: "/cot-moc", changefreq: "monthly", priority: 0.5 },
    { path: "/lien-he", changefreq: "monthly", priority: 0.5 },
    ...(products ?? []).map((p) => ({ path: `/san-pham/${p.slug}`, lastmod: iso(p.updated_at), changefreq: "weekly", priority: 0.8 })),
    ...(articles ?? []).map((a) => ({ path: `/tin-tuc/${a.slug}`, lastmod: iso(a.updated_at), changefreq: "monthly", priority: 0.6 })),
    ...(pages ?? []).map((p) => ({ path: `/${p.slug}`, lastmod: iso(p.updated_at), changefreq: "yearly", priority: 0.3 })),
  ];

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    entries.map(urlBlock).join("\n") +
    `\n</urlset>\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
