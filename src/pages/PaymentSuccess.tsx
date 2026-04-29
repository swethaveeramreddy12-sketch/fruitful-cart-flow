import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, Package } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";

type Status = "loading" | "paid" | "pending" | "error";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const { clear } = useCart();
  const [status, setStatus] = useState<Status>("loading");
  const [orderEmail, setOrderEmail] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!sessionId) {
        setStatus("error");
        return;
      }
      try {
        const { data, error } = await supabase.functions.invoke("verify-checkout", {
          body: { sessionId },
        });
        if (cancelled) return;
        if (error) throw error;
        if (data?.paid) {
          setStatus("paid");
          setOrderEmail(data.email ?? null);
          if (sessionStorage.getItem("anunatural_pending_clear") === "1") {
            clear();
            sessionStorage.removeItem("anunatural_pending_clear");
          }
        } else {
          setStatus("pending");
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setStatus("error");
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [sessionId, clear]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container flex min-h-[60vh] items-center justify-center py-16">
        <div className="w-full max-w-xl rounded-3xl bg-card p-10 text-center shadow-card sm:p-14">
          {status === "loading" && (
            <>
              <Loader2 className="mx-auto h-14 w-14 animate-spin text-primary" />
              <h1 className="mt-6 font-display text-3xl font-bold text-primary">Confirming your payment…</h1>
              <p className="mt-2 text-muted-foreground">Hang tight while we verify with our payment partner.</p>
            </>
          )}

          {status === "paid" && (
            <>
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-mango shadow-glow">
                <CheckCircle2 className="h-10 w-10 text-secondary-foreground" />
              </div>
              <h1 className="mt-6 font-display text-4xl font-bold text-primary">Payment successful!</h1>
              <p className="mt-3 text-muted-foreground">
                Thank you for your order. Your mangoes will be hand-packed and shipped within 24 hours.
              </p>
              {orderEmail && (
                <p className="mt-2 text-sm text-muted-foreground">
                  A confirmation has been sent to <span className="font-semibold text-foreground">{orderEmail}</span>.
                </p>
              )}
              <div className="mt-8 rounded-2xl bg-cream p-5 text-left">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-primary" />
                  <p className="text-sm font-semibold text-primary">What happens next?</p>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>• We&apos;ll notify the orchard and pack your order.</li>
                  <li>• You&apos;ll receive a tracking link within 24 hours.</li>
                  <li>• Delivery typically takes 2–4 days pan-India.</li>
                </ul>
              </div>
              <Link
                to="/"
                className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:scale-105 transition-transform"
              >
                Back to shop
              </Link>
            </>
          )}

          {status === "pending" && (
            <>
              <h1 className="font-display text-3xl font-bold text-primary">Payment pending</h1>
              <p className="mt-3 text-muted-foreground">
                Your payment hasn&apos;t completed yet. If money was deducted, it will be reflected shortly.
              </p>
              <Link to="/cart" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
                Back to cart
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <h1 className="font-display text-3xl font-bold text-destructive">Could not verify payment</h1>
              <p className="mt-3 text-muted-foreground">Please contact support with your order reference.</p>
              <Link to="/" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
                Back to home
              </Link>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
