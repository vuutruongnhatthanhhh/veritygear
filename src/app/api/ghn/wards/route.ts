import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ghnGetWards } from "@/lib/ghn";

export async function GET(request: NextRequest) {
  const districtId = Number(request.nextUrl.searchParams.get("district_id"));
  if (!districtId) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const admin = createAdminClient();
  const { data: settings } = await admin.from("ghn_settings").select("enabled, token").eq("id", 1).single();

  if (!settings?.enabled || !settings.token) {
    return NextResponse.json({ error: "ghn_disabled" }, { status: 400 });
  }

  try {
    const wards = await ghnGetWards({ token: settings.token }, districtId);
    return NextResponse.json({ wards });
  } catch (err) {
    console.error("GHN wards lookup failed:", err);
    return NextResponse.json({ error: "ghn_error" }, { status: 502 });
  }
}
