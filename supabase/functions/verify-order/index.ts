import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { merchantOrderId } = await req.json();
    if (typeof merchantOrderId !== "string" || merchantOrderId.length < 4) {
      return new Response(JSON.stringify({ error: "Invalid order id" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("merchant_order_id", merchantOrderId)
      .maybeSingle();

    if (error || !order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // COD: nothing to verify with PhonePe
    if (order.payment_method === "cod") {
      return new Response(JSON.stringify({
        status: order.status, method: "cod",
        email: order.customer_email, total: order.total, merchantOrderId,
      }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Already finalised
    if (order.status === "paid" || order.status === "failed") {
      return new Response(JSON.stringify({
        status: order.status, method: order.payment_method,
        email: order.customer_email, total: order.total, merchantOrderId,
      }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const merchantId = Deno.env.get("PHONEPE_MERCHANT_ID");
    const saltKey   = Deno.env.get("PHONEPE_SALT_KEY");
    const saltIndex = Deno.env.get("PHONEPE_SALT_INDEX") ?? "1";
    const env       = (Deno.env.get("PHONEPE_ENV") ?? "uat").toLowerCase();

    if (!merchantId || !saltKey) {
      return new Response(JSON.stringify({ error: "PhonePe not configured" }), {
        status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const baseUrl = env === "prod"
      ? "https://api.phonepe.com/apis/hermes"
      : "https://api-preprod.phonepe.com/apis/pg-sandbox";
    const path = `/pg/v1/status/${merchantId}/${merchantOrderId}`;
    const checksum = (await sha256Hex(path + saltKey)) + "###" + saltIndex;

    const resp = await fetch(baseUrl + path, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": merchantId,
        accept: "application/json",
      },
    });
    const data = await resp.json();
    console.log("PhonePe status", JSON.stringify(data));

    let newStatus = order.status as string;
    const code = data?.code;
    if (code === "PAYMENT_SUCCESS") newStatus = "paid";
    else if (code === "PAYMENT_ERROR" || code === "PAYMENT_DECLINED" || code === "TIMED_OUT") newStatus = "failed";

    if (newStatus !== order.status) {
      await supabase
        .from("orders")
        .update({
          status: newStatus,
          phonepe_transaction_id: data?.data?.transactionId ?? null,
        })
        .eq("merchant_order_id", merchantOrderId);
    }

    return new Response(JSON.stringify({
      status: newStatus, method: order.payment_method,
      email: order.customer_email, total: order.total, merchantOrderId,
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
