export type SocialPlatform = "facebook" | "instagram" | "tiktok" | "youtube";
export type SocialLink = { platform: SocialPlatform; url: string };

export const FALLBACK_SOCIAL_LINKS: SocialLink[] = [
  { platform: "facebook", url: "#" },
  { platform: "instagram", url: "#" },
  { platform: "tiktok", url: "#" },
  { platform: "youtube", url: "#" },
];

type SiteSocialLinksRow = {
  facebook_url: string;
  facebook_active: boolean;
  instagram_url: string;
  instagram_active: boolean;
  tiktok_url: string;
  tiktok_active: boolean;
  youtube_url: string;
  youtube_active: boolean;
} | null;

// Shared by every call site (Footer, ContactMap, Header) that reads
// `site_social_links` and renders <SocialLinks> — keeps the "only show
// active platforms with a real URL" rule in one place.
export function toSocialLinks(row: SiteSocialLinksRow): SocialLink[] {
  if (!row) return FALLBACK_SOCIAL_LINKS;

  const links: SocialLink[] = [];
  if (row.facebook_active && row.facebook_url) links.push({ platform: "facebook", url: row.facebook_url });
  if (row.instagram_active && row.instagram_url) links.push({ platform: "instagram", url: row.instagram_url });
  if (row.tiktok_active && row.tiktok_url) links.push({ platform: "tiktok", url: row.tiktok_url });
  if (row.youtube_active && row.youtube_url) links.push({ platform: "youtube", url: row.youtube_url });

  return links.length > 0 ? links : FALLBACK_SOCIAL_LINKS;
}
