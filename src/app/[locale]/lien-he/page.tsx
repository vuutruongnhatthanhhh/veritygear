import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import ContactHero from "@/components/contact/ContactHero";
import ContactInfoCards from "@/components/contact/ContactInfoCards";
import ContactForm from "@/components/contact/ContactForm";
import ContactMap from "@/components/contact/ContactMap";
import ContactFaq from "@/components/contact/ContactFaq";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("seo");
  return pageMetadata({
    locale,
    path: "/lien-he",
    title: t("contactTitle"),
    description: t("contactDescription"),
  });
}

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactInfoCards />

      <section className="border-y border-ink/10 bg-ink/[0.02] px-6 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto grid max-w-[1600px] gap-14 lg:grid-cols-2">
          <ContactForm />
          <ContactMap />
        </div>
      </section>

      <ContactFaq />
    </>
  );
}
