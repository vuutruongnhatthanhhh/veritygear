import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    // Supabase Storage URLs never change in place (the admin upload API
    // always writes a new timestamped filename, never overwrites), so the
    // 4-hour default is needlessly short — it forces re-optimizing the same
    // unchanged images every few hours under normal traffic.
    minimumCacheTTL: 2678400, // 31 days
  },
};

export default withNextIntl(nextConfig);
