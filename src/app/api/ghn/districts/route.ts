import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ghnGetDistricts } from "@/lib/ghn";

export async function GET(request: NextRequest) {
  const provinceId = Number(request.nextUrl.searchParams.get("province_id"));
  if (!provinceId) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const admin = createAdminClient();
  const { data: settings } = await admin.from("ghn_settings").select("enabled, token").eq("id", 1).single();

  if (!settings?.enabled || !settings.token) {
    return NextResponse.json({ error: "ghn_disabled" }, { status: 400 });
  }

  try {
    const districts = await ghnGetDistricts({ token: settings.token }, provinceId);
    return NextResponse.json({ districts });
  } catch (err) {
    console.error("GHN districts lookup failed:", err);
    return NextResponse.json({ error: "ghn_error" }, { status: 502 });
  }
}
