import { notFound } from "next/navigation";

// Catch-all for any multi-segment path that matches no real route, so it
// renders the styled [locale]/not-found.tsx (with header/footer) instead of
// Next's bare default 404. Single-segment unknown paths are handled by
// [slug]/page.tsx, which calls notFound() when no custom page matches.
export default function CatchAllNotFound() {
  notFound();
}
