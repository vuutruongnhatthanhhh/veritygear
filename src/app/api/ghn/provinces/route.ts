import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ghnGetProvinces } from "@/lib/ghn";

export async function GET() {
  const admin = createAdminClient();
  const { data: settings } = await admin.from("ghn_settings").select("enabled, token").eq("id", 1).single();

  if (!settings?.enabled || !settings.token) {
    return NextResponse.json({ error: "ghn_disabled" }, { status: 400 });
  }

  try {
    const provinces = await ghnGetProvinces({ token: settings.token });
    return NextResponse.json({ provinces });
  } catch (err) {
    console.error("GHN provinces lookup failed:", err);
    return NextResponse.json({ error: "ghn_error" }, { status: 502 });
  }
}
