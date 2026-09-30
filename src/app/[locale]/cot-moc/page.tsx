import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import MilestonesHero from "@/components/milestones/MilestonesHero";
import Timeline from "@/components/milestones/Timeline";
import ProductLineup from "@/components/milestones/ProductLineup";
import StatsRow from "@/components/about/StatsRow";
import AboutCta from "@/components/about/AboutCta";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("seo");
  return pageMetadata({
    locale,
    path: "/cot-moc",
    title: t("milestonesTitle"),
    description: t("milestonesDescription"),
  });
}

export default function MilestonesPage() {
  return (
    <>
      <MilestonesHero />
      <Timeline />
      <ProductLineup />
      <StatsRow />
      <AboutCta />
    </>
  );
}
