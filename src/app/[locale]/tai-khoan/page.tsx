import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { AccountForm } from "./account-form";

export const metadata = { title: "Tài khoản — VERITY GEAR", robots: { index: false, follow: false } };

export default async function TaiKhoanPage() {
  const t = await getTranslations("account");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const locale = await getLocale();
    redirect({ href: "/dang-nhap?next=/tai-khoan", locale });
    return;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, address")
    .eq("id", user.id)
    .single();

  return (
    <section className="mx-auto max-w-xl px-6 py-32">
      <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.35em] text-ink">
        {t("eyebrow")}
      </p>
      <h1 className="mb-8 text-center font-display text-3xl font-bold uppercase leading-tight sm:text-4xl">
        {t("heading")}
      </h1>

      <AccountForm email={user.email ?? ""} profile={profile} />

      <Link
        href="/tai-khoan/don-hang"
        className="mt-6 flex h-13 w-full items-center justify-center border border-ink/15 text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/70 transition-colors hover:border-ink hover:text-ink"
      >
        {t("myOrders")}
      </Link>
    </section>
  );
}
