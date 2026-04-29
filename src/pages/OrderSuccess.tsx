import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, Package, XCircle, Wallet } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart, formatINR } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";

type Result = {
  status: "paid" | "placed" | "pending" | "failed";
  method: "phonepe" | "cod";
  email?: string;
  total?: number;
  merchantOrderId?: string;
};

const OrderSuccess = () => {
  const [params] = useSearchParams();
  const merchantOrderId = params.get("order");
  const { clear } = useCart();
  const [result, setResult] = useState<Result | null>(null);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    if (!merchantOrderId) { setErrored(true); return; }
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("verify-order", {
          body: { merchantOrderId },
        });
        if (cancelled) return;
        if (error) throw error;
        setResult(data as Result);
        if ((data?.status === "paid" || data?.status === "placed")
            && sessionStorage.getItem("anunatural_pending_clear") === "1") {
          clear();
          sessionStorage.removeItem("anunatural_pending_clear");
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setErrored(true);
      }
    })();
    return () => { cancelled = true; };
  }, [merchantOrderId, clear]);

  const isOk = result?.status === "paid" || result?.status === "placed";
  const isFail = result?.status === "failed" || errored;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container flex min-h-[60vh] items-center justify-center py-16">
        <div className="w-full max-w-xl rounded-3xl bg-card p-10 text-center shadow-card sm:p-14">
          {!result && !errored && (
            <>
              <Loader2 className="mx-auto h-14 w-14 animate-spin text-primary" />
              <h1 className="mt-6 font-display text-3xl font-bold text-primary">Confirming your order…</h1>
            </>
          )}

          {isOk && result && (
            <>
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-mango shadow-glow">
                {result.method === "cod"
                  ? <Wallet className="h-10 w-10 text-secondary-foreground" />
                  : <CheckCircle2 className="h-10 w-10 text-secondary-foreground" />}
              </div>
              <h1 className="mt-6 font-display text-4xl font-bold text-primary">
                {result.method === "cod" ? "Order placed!" : "Payment successful!"}
              </h1>
              <p className="mt-3 text-muted-foreground">
                {result.method === "cod"
                  ? "Your mangoes are on the way. Please keep the exact cash ready at delivery."
                  : "Thank you for your order. Your mangoes will be hand-packed and shipped within 24 hours."}
              </p>
              {result.email && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Order confirmation sent to <span className="font-semibold text-foreground">{result.email}</span>.
                </p>
              )}
              {result.total != null && (
                <p className="mt-4 inline-block rounded-full bg-cream px-4 py-1.5 text-sm font-semibold text-primary">
                  {result.method === "cod" ? "Pay on delivery: " : "Paid: "} {formatINR(result.total)}
                </p>
              )}
              {result.merchantOrderId && (
                <p className="mt-2 text-xs text-muted-foreground">Order ID: {result.merchantOrderId}</p>
              )}
              <div className="mt-8 rounded-2xl bg-cream p-5 text-left">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-primary" />
                  <p className="text-sm font-semibold text-primary">What happens next?</p>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>• We'll notify the orchard and pack your order.</li>
                  <li>• You'll receive a tracking link within 24 hours.</li>
                  <li>• Delivery typically takes 2–4 days pan-India.</li>
                </ul>
              </div>
              <Link to="/" className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:scale-105 transition-transform">
                Back to shop
              </Link>
            </>
          )}

          {result?.status === "pending" && (
            <>
              <Loader2 className="mx-auto h-14 w-14 animate-spin text-primary" />
              <h1 className="mt-6 font-display text-3xl font-bold text-primary">Payment pending</h1>
              <p className="mt-3 text-muted-foreground">We're still waiting on confirmation from PhonePe. This page will update shortly — feel free to refresh.</p>
            </>
          )}

          {isFail && (
            <>
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-destructive/10">
                <XCircle className="h-10 w-10 text-destructive" />
              </div>
              <h1 className="mt-6 font-display text-3xl font-bold text-destructive">Payment failed</h1>
              <p className="mt-3 text-muted-foreground">No money was deducted, or it will be refunded automatically. Please try again.</p>
              <Link to="/cart" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
                Back to cart
              </Link>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderSuccess;
