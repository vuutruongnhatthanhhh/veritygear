import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import AboutHero from "@/components/about/AboutHero";
import MissionStatement from "@/components/about/MissionStatement";
import AboutStoryBlocks from "@/components/about/AboutStoryBlocks";
import StatsRow from "@/components/about/StatsRow";
import ValuesGrid from "@/components/about/ValuesGrid";
import Team from "@/components/about/Team";
import Gallery from "@/components/about/Gallery";
import AboutCta from "@/components/about/AboutCta";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("seo");
  return pageMetadata({
    locale,
    path: "/gioi-thieu",
    title: t("aboutTitle"),
    description: t("aboutDescription"),
  });
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <MissionStatement />
      <AboutStoryBlocks />

      <div className="pt-24 sm:pt-32">
        <StatsRow />
      </div>
      <ValuesGrid />
      <Team />
      <Gallery />
      <AboutCta />
    </>
  );
}
