import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Inter, Space_Grotesk } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { CartProvider } from "@/components/providers/CartProvider";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { createClient } from "@/lib/supabase/public";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, absoluteUrl } from "@/lib/seo";
import { routing } from "@/i18n/routing";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

async function getSeoSettings() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("seo_settings").select("*").eq("id", 1).maybeSingle();
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "metadata" });
  const seo = await getSeoSettings();
  const pick = (vi?: string | null, en?: string | null) => (locale === "en" ? en || vi : vi) || "";

  const siteName = seo?.site_name || SITE_NAME;
  const title = pick(seo?.title_vi, seo?.title_en) || t("title");
  const description = pick(seo?.description_vi, seo?.description_en) || t("description");
  const keywords = pick(seo?.keywords_vi, seo?.keywords_en);
  const ogImage = seo?.og_image_url || DEFAULT_OG_IMAGE;
  const ogImageAbs = /^https?:\/\//i.test(ogImage) ? ogImage : `${SITE_URL}${ogImage}`;
  const homeUrl = absoluteUrl(locale, "/");

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s — ${siteName}`,
    },
    description,
    ...(keywords ? { keywords } : {}),
    applicationName: siteName,
    alternates: {
      canonical: homeUrl,
      languages: {
        vi: absoluteUrl("vi", "/"),
        en: absoluteUrl("en", "/"),
        "x-default": absoluteUrl("vi", "/"),
      },
    },
    openGraph: {
      type: "website",
      url: homeUrl,
      siteName,
      title,
      description,
      locale: locale === "en" ? "en_US" : "vi_VN",
      alternateLocale: locale === "en" ? "vi_VN" : "en_US",
      images: [ogImageAbs],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageAbs],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink font-sans">
        <OrganizationJsonLd />
        <NextIntlClientProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <ScrollToTopButton />
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
