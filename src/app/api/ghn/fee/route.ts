import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ghnCalculateFee } from "@/lib/ghn";

type FeeRequestItem = { slug: string; qty: number };

export async function POST(request: NextRequest) {
  let body: { toDistrictId?: number; toWardCode?: string; items?: FeeRequestItem[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const toDistrictId = Number(body.toDistrictId);
  const toWardCode = (body.toWardCode ?? "").trim();
  const items = Array.isArray(body.items) ? body.items : [];

  if (!toDistrictId || !toWardCode || items.length === 0) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: settings } = await admin.from("ghn_settings").select("*").eq("id", 1).single();

  if (!settings?.enabled || !settings.token || !settings.shop_id) {
    return NextResponse.json({ error: "ghn_disabled" }, { status: 400 });
  }

  const slugs = items.map((i) => i.slug);
  const { data: products } = await admin.from("products").select("slug, weight_grams").in("slug", slugs);
  const weightBySlug = new Map((products ?? []).map((p) => [p.slug, p.weight_grams]));
  const totalWeight = items.reduce((sum, i) => sum + (weightBySlug.get(i.slug) ?? 500) * i.qty, 0);

  try {
    const fee = await ghnCalculateFee(
      { token: settings.token, shopId: settings.shop_id },
      {
        serviceTypeId: settings.service_type_id,
        toDistrictId,
        toWardCode,
        weightGrams: totalWeight,
      },
    );
    return NextResponse.json({ fee });
  } catch (err) {
    console.error("GHN fee calculation failed:", err);
    return NextResponse.json({ error: (err as Error).message || "ghn_error" }, { status: 502 });
  }
}
