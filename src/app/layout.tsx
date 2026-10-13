import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

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

// The true App Router root — kept minimal so top-level routes outside
// `[locale]` (like /coming-soon) render without the site's Header/Footer/
// CartProvider/i18n chrome. `[locale]/layout.tsx` nests inside this and adds
// all of that for every normal page.
// `lang` is hardcoded instead of read from the locale: calling getLocale()
// (or headers()/cookies()) here would opt every single page in the app out
// of static rendering, since that flag applies per-route from the outermost
// layout down. [locale]/layout.tsx has the real locale via `params` (which
// doesn't force dynamic) but can no longer set <html> itself now that this
// root layout owns it — a static "vi" default is the trade-off for keeping
// the whole site's ISR/SSG performance intact.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-paper text-ink font-sans">{children}</body>
    </html>
  );
}
