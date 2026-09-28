import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapGhnStatusToOrderStatus } from "@/lib/ghn";

// GHN does not sign webhook payloads, so this route is protected by a shared
// secret in the query string instead — register the webhook URL in the GHN
// shop dashboard as: https://<domain>/api/webhooks/ghn?secret=<GHN_WEBHOOK_SECRET>
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (!process.env.GHN_WEBHOOK_SECRET || secret !== process.env.GHN_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { OrderCode?: string; Status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const ghnOrderCode = body.OrderCode;
  const ghnStatus = body.Status;
  if (!ghnOrderCode || !ghnStatus) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const admin = createAdminClient();
  const payload: Record<string, unknown> = { ghn_status: ghnStatus, updated_at: new Date().toISOString() };

  const mappedStatus = mapGhnStatusToOrderStatus(ghnStatus);
  if (mappedStatus) payload.status = mappedStatus;

  const { error } = await admin.from("orders").update(payload).eq("ghn_order_code", ghnOrderCode);
  if (error) {
    console.error("Failed to apply GHN webhook update:", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
