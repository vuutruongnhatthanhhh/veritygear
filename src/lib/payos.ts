import { PayOS } from "@payos/node";

let client: PayOS | null = null;

// Lazy singleton so pages that don't touch PayOS (browsing, COD checkout)
// keep working even before the env vars are filled in.
export function getPayOS(): PayOS {
  if (!client) {
    const clientId = process.env.PAYOS_CLIENT_ID;
    const apiKey = process.env.PAYOS_API_KEY;
    const checksumKey = process.env.PAYOS_CHECKSUM_KEY;
    if (!clientId || !apiKey || !checksumKey) {
      throw new Error("Thiếu cấu hình PayOS (PAYOS_CLIENT_ID / PAYOS_API_KEY / PAYOS_CHECKSUM_KEY)");
    }
    client = new PayOS({ clientId, apiKey, checksumKey });
  }
  return client;
}
