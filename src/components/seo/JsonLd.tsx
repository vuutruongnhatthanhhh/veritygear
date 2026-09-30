import { createClient } from "@/lib/supabase/server";
import { toSocialLinks } from "@/lib/socialLinks";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

// Renders a <script type="application/ld+json"> block. JSON.stringify output is
// safe inside this tag; we only guard the "</" sequence that could close it early.
function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

// Site-wide Organization schema — rendered once in the root layout.
export async function OrganizationJsonLd() {
  let sameAs: string[] = [];
  let siteName = SITE_NAME;
  let logo = `${SITE_URL}/images/logo/logo-dark.png`;

  try {
    const supabase = await createClient();
    const [{ data: socialRow }, { data: seo }] = await Promise.all([
      supabase.from("site_social_links").select("*").eq("id", 1).maybeSingle(),
      supabase.from("seo_settings").select("site_name, og_image_url").eq("id", 1).maybeSingle(),
    ]);
    sameAs = toSocialLinks(socialRow).map((l) => l.url).filter((u) => u && u !== "#");
    if (seo?.site_name) siteName = seo.site_name;
    if (seo?.og_image_url) {
      logo = /^https?:\/\//i.test(seo.og_image_url) ? seo.og_image_url : `${SITE_URL}${seo.og_image_url}`;
    }
  } catch {
    // seo_settings / social table not migrated yet — emit minimal schema.
  }

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: siteName,
        url: SITE_URL,
        logo,
        ...(sameAs.length ? { sameAs } : {}),
      }}
    />
  );
}

export function ProductJsonLd({
  name,
  description,
  image,
  price,
  url,
  brand = SITE_NAME,
}: {
  name: string;
  description: string;
  image?: string;
  price: number;
  url: string;
  brand?: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name,
        description,
        ...(image ? { image } : {}),
        brand: { "@type": "Brand", name: brand },
        offers: {
          "@type": "Offer",
          url,
          priceCurrency: "VND",
          price: String(price),
          availability: "https://schema.org/InStock",
        },
      }}
    />
  );
}

export function ArticleJsonLd({
  headline,
  description,
  image,
  url,
  datePublished,
}: {
  headline: string;
  description: string;
  image?: string;
  url: string;
  datePublished?: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline,
        description,
        ...(image ? { image } : {}),
        ...(datePublished ? { datePublished } : {}),
        url,
        publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}
