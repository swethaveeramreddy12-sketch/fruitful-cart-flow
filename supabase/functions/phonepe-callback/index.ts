import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-verify",
};

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// PhonePe S2S callback. Body: { response: <base64> }, header X-VERIFY = sha256(body + saltKey) + "###" + saltIndex
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const saltKey   = Deno.env.get("PHONEPE_SALT_KEY");
    const saltIndex = Deno.env.get("PHONEPE_SALT_INDEX") ?? "1";
    if (!saltKey) return new Response("not configured", { status: 503, headers: corsHeaders });

    const raw = await req.text();
    const xVerify = req.headers.get("x-verify") ?? "";
    const expected = (await sha256Hex(raw + saltKey)) + "###" + saltIndex;
    if (xVerify !== expected) {
      console.warn("Invalid X-VERIFY on phonepe-callback");
      return new Response("invalid signature", { status: 401, headers: corsHeaders });
    }

    const body = JSON.parse(raw) as { response?: string };
    if (!body.response) return new Response("missing response", { status: 400, headers: corsHeaders });

    const decoded = JSON.parse(atob(body.response));
    console.log("PhonePe callback", JSON.stringify(decoded));

    const merchantOrderId =
      decoded?.data?.merchantTransactionId ?? decoded?.merchantTransactionId;
    const code = decoded?.code;
    if (!merchantOrderId) return new Response("missing order id", { status: 400, headers: corsHeaders });

    let status: "paid" | "failed" | null = null;
    if (code === "PAYMENT_SUCCESS") status = "paid";
    else if (code === "PAYMENT_ERROR" || code === "PAYMENT_DECLINED" || code === "TIMED_OUT") status = "failed";

    if (status) {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      );
      await supabase
        .from("orders")
        .update({
          status,
          phonepe_transaction_id: decoded?.data?.transactionId ?? null,
        })
        .eq("merchant_order_id", merchantOrderId);
    }

    return new Response("ok", { status: 200, headers: corsHeaders });
  } catch (e) {
    console.error(e);
    return new Response("error", { status: 500, headers: corsHeaders });
  }
});
