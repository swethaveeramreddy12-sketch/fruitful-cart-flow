import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Server-side product catalogue (mirrors src/data/products.ts).
// Pricing MUST come from server, never trust client.
const PRODUCTS: Record<string, { name: string; price: number }> = {
  alphonso:     { name: "Alphonso",            price: 1499 },
  banganapalli: { name: "Banganapalli",        price: 999 },
  kesar:        { name: "Kesar",               price: 1199 },
  dasheri:      { name: "Dasheri",             price: 849 },
  langra:       { name: "Langra",              price: 899 },
  himayat:      { name: "Himayat (Imam Pasand)", price: 1799 },
};

type Item = { productId: string; quantity: number };
type Customer = {
  name: string; email: string; phone: string;
  address: string; city: string; pincode: string;
};

function validate(body: any): { customer: Customer; items: Item[]; method: "phonepe" | "cod" } | string {
  if (!body || typeof body !== "object") return "Invalid body";
  const { customer, items, method } = body;
  if (!customer || typeof customer !== "object") return "Missing customer";
  for (const f of ["name", "email", "phone", "address", "city", "pincode"]) {
    if (typeof customer[f] !== "string" || customer[f].length < 2) return `Invalid ${f}`;
  }
  if (!/^\S+@\S+\.\S+$/.test(customer.email)) return "Invalid email";
  if (!Array.isArray(items) || items.length === 0) return "Cart is empty";
  for (const it of items) {
    if (!PRODUCTS[it.productId]) return `Unknown product ${it.productId}`;
    if (!Number.isInteger(it.quantity) || it.quantity < 1 || it.quantity > 50) return "Invalid quantity";
  }
  if (method !== "phonepe" && method !== "cod") return "Invalid payment method";
  return { customer, items, method };
}

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const parsed = validate(await req.json());
    if (typeof parsed === "string") {
      return new Response(JSON.stringify({ error: parsed }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { customer, items, method } = parsed;

    // Recompute totals server-side
    const subtotal = items.reduce((s, it) => s + PRODUCTS[it.productId].price * it.quantity, 0);
    const shipping = subtotal >= 1500 ? 0 : 99;
    const total = subtotal + shipping;
    const merchantOrderId = `ANU-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Extract user_id from JWT if caller is signed in (verify_jwt = false, so optional).
    let userId: string | null = null;
    const authHeader = req.headers.get("authorization") ?? "";
    const token = authHeader.toLowerCase().startsWith("bearer ") ? authHeader.slice(7) : "";
    if (token) {
      const { data: u } = await supabase.auth.getUser(token);
      userId = u.user?.id ?? null;
    }

    const { data: order, error: insErr } = await supabase
      .from("orders")
      .insert({
        merchant_order_id: merchantOrderId,
        user_id: userId,
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        address: customer.address,
        city: customer.city,
        pincode: customer.pincode,
        items: items.map((i) => ({
          productId: i.productId,
          name: PRODUCTS[i.productId].name,
          quantity: i.quantity,
          price: PRODUCTS[i.productId].price,
        })),
        subtotal,
        shipping,
        total,
        payment_method: method,
        status: method === "cod" ? "placed" : "pending",
      })
      .select()
      .single();

    if (insErr || !order) {
      console.error("Insert error", insErr);
      return new Response(JSON.stringify({ error: "Could not create order" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const origin = req.headers.get("origin") ?? req.headers.get("referer")?.split("/").slice(0, 3).join("/") ?? "";
    const successUrl = `${origin}/order-success?order=${merchantOrderId}`;

    if (method === "cod") {
      return new Response(
        JSON.stringify({ method: "cod", merchantOrderId, redirectUrl: successUrl }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ---- PhonePe Standard Checkout (PG) ----
    const merchantId  = Deno.env.get("PHONEPE_MERCHANT_ID");
    const saltKey     = Deno.env.get("PHONEPE_SALT_KEY");
    const saltIndex   = Deno.env.get("PHONEPE_SALT_INDEX") ?? "1";
    const env         = (Deno.env.get("PHONEPE_ENV") ?? "uat").toLowerCase();

    if (!merchantId || !saltKey) {
      return new Response(
        JSON.stringify({ error: "PhonePe is not configured yet. Please add merchant credentials." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const baseUrl = env === "prod"
      ? "https://api.phonepe.com/apis/hermes"
      : "https://api-preprod.phonepe.com/apis/pg-sandbox";
    const path = "/pg/v1/pay";

    const payload = {
      merchantId,
      merchantTransactionId: merchantOrderId,
      merchantUserId: `USR-${customer.email.replace(/[^a-zA-Z0-9]/g, "").slice(0, 20)}`,
      amount: total * 100, // paise
      redirectUrl: successUrl,
      redirectMode: "REDIRECT",
      callbackUrl: `${Deno.env.get("SUPABASE_URL")}/functions/v1/phonepe-callback`,
      mobileNumber: customer.phone.replace(/\D/g, "").slice(-10),
      paymentInstrument: { type: "PAY_PAGE" },
    };

    const base64Payload = btoa(JSON.stringify(payload));
    const checksum = (await sha256Hex(base64Payload + path + saltKey)) + "###" + saltIndex;

    const resp = await fetch(baseUrl + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        accept: "application/json",
      },
      body: JSON.stringify({ request: base64Payload }),
    });
    const data = await resp.json();
    console.log("PhonePe pay response", JSON.stringify(data));

    const redirectUrl = data?.data?.instrumentResponse?.redirectInfo?.url;
    if (!resp.ok || !redirectUrl) {
      return new Response(
        JSON.stringify({ error: data?.message ?? "PhonePe init failed", details: data }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ method: "phonepe", merchantOrderId, redirectUrl }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
