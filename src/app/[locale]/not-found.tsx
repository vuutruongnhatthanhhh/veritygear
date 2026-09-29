import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col items-center px-6 py-32 text-center sm:px-10 sm:py-40">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-ink/40">{t("eyebrow")}</p>
      <p className="font-display text-7xl font-bold leading-none text-ink sm:text-8xl">404</p>
      <h1 className="mt-6 font-display text-3xl font-bold uppercase leading-[1.05] sm:text-4xl">{t("heading")}</h1>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink/60">{t("body")}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex h-13 items-center bg-ink px-8 text-[13px] font-semibold uppercase tracking-[0.14em] text-paper transition-transform hover:scale-[1.02]"
        >
          {t("backHome")}
        </Link>
        <Link
          href="/san-pham"
          className="inline-flex h-13 items-center border border-ink/20 px-8 text-[13px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink"
        >
          {t("exploreProducts")}
        </Link>
      </div>
    </div>
  );
}
