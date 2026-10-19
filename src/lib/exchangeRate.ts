import { createClient } from "@/lib/supabase/public";

const DEFAULT_USD_TO_VND = 25000;

// Display-only rate (admin-configured) used to show a USD-equivalent price
// on the English locale. Actual payment always settles in VND via PayOS.
export async function getExchangeRate(): Promise<number> {
  const supabase = await createClient();
  const { data } = await supabase.from("exchange_rate_settings").select("usd_to_vnd_rate").eq("id", 1).single();
  return data?.usd_to_vnd_rate ?? DEFAULT_USD_TO_VND;
}
