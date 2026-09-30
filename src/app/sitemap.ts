import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { absoluteUrl } from "@/lib/seo";

// Read-only anon client (no cookies needed) for the public content tables.
function publicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}

// Emits one entry per canonical path with hreflang alternates for vi + en,
// so Google indexes both language versions and understands they're the same page.
function entry(
  path: string,
  opts?: { lastModified?: string | Date; changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"]; priority?: number },
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl("vi", path),
    lastModified: opts?.lastModified,
    changeFrequency: opts?.changeFrequency,
    priority: opts?.priority,
    alternates: {
      languages: {
        vi: absoluteUrl("vi", path),
        en: absoluteUrl("en", path),
      },
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = publicClient();

  const [{ data: products }, { data: articles }, { data: pages }] = await Promise.all([
    supabase.from("products").select("slug, updated_at").eq("is_active", true),
    supabase.from("news_articles").select("slug, updated_at").eq("is_active", true),
    supabase.from("custom_pages").select("slug, updated_at").eq("is_active", true),
  ]);

  const staticEntries: MetadataRoute.Sitemap = [
    entry("/", { changeFrequency: "weekly", priority: 1 }),
    entry("/san-pham", { changeFrequency: "daily", priority: 0.9 }),
    entry("/tin-tuc", { changeFrequency: "daily", priority: 0.7 }),
    entry("/gioi-thieu", { changeFrequency: "monthly", priority: 0.5 }),
    entry("/cot-moc", { changeFrequency: "monthly", priority: 0.5 }),
    entry("/lien-he", { changeFrequency: "monthly", priority: 0.5 }),
  ];

  const productEntries = (products ?? []).map((p) =>
    entry(`/san-pham/${p.slug}`, { lastModified: p.updated_at ?? undefined, changeFrequency: "weekly", priority: 0.8 }),
  );
  const articleEntries = (articles ?? []).map((a) =>
    entry(`/tin-tuc/${a.slug}`, { lastModified: a.updated_at ?? undefined, changeFrequency: "monthly", priority: 0.6 }),
  );
  const pageEntries = (pages ?? []).map((p) =>
    entry(`/${p.slug}`, { lastModified: p.updated_at ?? undefined, changeFrequency: "yearly", priority: 0.3 }),
  );

  return [...staticEntries, ...productEntries, ...articleEntries, ...pageEntries];
}

export const dynamic = "force-dynamic";
