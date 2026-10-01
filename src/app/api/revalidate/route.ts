import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// Called by veritygear-admin right after a content save, so edits show up
// immediately instead of waiting out the page's normal ISR window (60s–300s).
// Protected by a shared secret (checked via header, same pattern as the PayOS
// checksum check — not a public endpoint).
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { paths?: string[]; layoutPaths?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const paths = Array.isArray(body.paths) ? body.paths.filter((p) => typeof p === "string") : [];
  const layoutPaths = Array.isArray(body.layoutPaths) ? body.layoutPaths.filter((p) => typeof p === "string") : [];

  if (paths.length === 0 && layoutPaths.length === 0) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  for (const path of paths) revalidatePath(path);
  for (const path of layoutPaths) revalidatePath(path, "layout");

  return NextResponse.json({ ok: true, revalidated: [...paths, ...layoutPaths] });
}
