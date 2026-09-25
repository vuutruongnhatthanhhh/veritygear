import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import SocialLinks from "./SocialLinks";
import { createClient } from "@/lib/supabase/server";
import { toSocialLinks } from "@/lib/socialLinks";

export default async function Footer() {
  const t = await getTranslations();
  const locale = await getLocale();
  const pick = (vi: string, en: string) => (locale === "en" ? en || vi : vi);
  const supabase = await createClient();
  const [{ data: socialRow }, { data: categoryRows }, { data: footerRow }] = await Promise.all([
    supabase.from("site_social_links").select("*").eq("id", 1).single(),
    supabase.from("product_categories").select("slug, name_vi, name_en").order("sort_order"),
    supabase.from("site_footer").select("*").eq("id", 1).single(),
  ]);
  const socialLinks = toSocialLinks(socialRow);
  const tagline = footerRow ? pick(footerRow.tagline_vi, footerRow.tagline_en) : "";

  const columns = [
    {
      title: t("footer.productsTitle"),
      links: (categoryRows ?? []).map((c) => ({
        label: pick(c.name_vi, c.name_en),
        href: `/san-pham?danh-muc=${c.slug}`,
      })),
    },
    {
      title: t("footer.companyTitle"),
      links: [
        { label: t("nav.cotMoc"), href: "/cot-moc" },
        { label: t("nav.gioiThieu"), href: "/gioi-thieu" },
        { label: t("nav.tinTuc"), href: "/tin-tuc" },
      ],
    },
    {
      title: t("footer.supportTitle"),
      links: [{ label: t("nav.lienHe"), href: "/lien-he" }],
    },
  ];

  return (
    <footer id="lien-he" className="border-t border-ink/10 bg-ink text-paper">
      <div className="mx-auto max-w-[1600px] px-6 py-16 sm:px-10 sm:py-20">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-2 md:grid-cols-5">
          <div className="col-span-2">
            <Image
              src="/images/logo/logo-white.png"
              alt="VERITY GEAR"
              width={236}
              height={100}
              className="h-20 w-47 object-contain object-left"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/60">{tagline}</p>
            <SocialLinks links={socialLinks} variant="dark" className="mt-6" />
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-paper/40">
                {col.title}
              </h4>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-paper/70 transition-colors hover:text-paper"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-paper/10 pt-8 text-xs text-paper/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} VERITY GEAR. All rights reserved.</p>
          <p>
            {t("footer.designedBy")}{" "}
            <a
              href="https://tjzenn.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-paper/70 underline underline-offset-2 transition-colors hover:text-paper"
            >
              TJZenn
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
