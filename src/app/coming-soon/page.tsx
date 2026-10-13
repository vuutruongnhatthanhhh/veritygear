import type { Metadata } from "next";
import Image from "next/image";
import SocialLinks from "@/components/SocialLinks";
import { ComingSoonMessage } from "@/components/ComingSoonMessage";
import { createClient } from "@/lib/supabase/public";
import { toSocialLinks } from "@/lib/socialLinks";

export const metadata: Metadata = {
  title: "Coming soon — VERITY GEAR",
  robots: { index: false, follow: false },
};

export const revalidate = 60;

export default async function ComingSoonPage() {
  const supabase = await createClient();
  const { data: socialRow } = await supabase.from("site_social_links").select("*").eq("id", 1).single();
  const socialLinks = toSocialLinks(socialRow);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink px-6 py-20 text-center">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper/5 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(250,250,249,0.08)_1px,transparent_0)] bg-[size:28px_28px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <Image src="/images/logo/logo-white.png" alt="VERITY GEAR" width={200} height={85} className="mb-10 h-auto w-40 object-contain sm:w-48" priority />

        <ComingSoonMessage />

        <div className="mt-12 h-px w-16 bg-paper/15" />

        <SocialLinks links={socialLinks} variant="dark" className="mt-10" />
      </div>
    </div>
  );
}
