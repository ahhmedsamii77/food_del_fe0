import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVerifyOrder } from "@/lib/hooks";
import { toast } from "sonner";

export default function VerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { mutate: verifyOrder, isPending } = useVerifyOrder();

  useEffect(() => {
    if (orderId && success !== null) {
      verifyOrder(
        { orderId, success: success as string },
        {
          onSuccess: (res) => {
            if (res.data.success) {
              toast.success("Payment confirmed! Your order is being processed 🎉");
            } else {
              toast.error("Payment cancelled — your order has been removed");
            }
          },
          onError: () => toast.error("Verification failed"),
        },
      );
    }
  }, []);

  const isPaymentSuccess = success === "true";

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-[radial-gradient(ellipse_at_top,oklch(97%_0.03_60),oklch(99%_0_0))]">
      <div className="max-w-sm w-full text-center animate-fade-in">

        {isPending ? (
          /* ── Loading ── */
          <div className="space-y-5">
            <div className="flex justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Verifying payment…</h2>
              <p className="text-muted-foreground mt-2 text-sm">
                Please wait while we confirm your order
              </p>
            </div>
          </div>

        ) : isPaymentSuccess ? (
          /* ── Success ── */
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 border-2 border-emerald-200">
                <CheckCircle className="h-12 w-12 text-emerald-500" />
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-extrabold text-emerald-600 mb-2">
                Order Confirmed!
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Your payment was successful. Your food is being prepared and
                will be delivered soon 🍕
              </p>
            </div>

            <div className="rounded-2xl border border-border/50 bg-card p-5 text-left space-y-2 shadow-sm">
              <div className="flex items-center gap-2 text-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-muted-foreground">Payment received</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-muted-foreground">Kitchen preparing your food</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="h-2 w-2 rounded-full bg-border" />
                <span className="text-muted-foreground">Delivery on the way</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                id="view-orders-btn"
                className="flex-1 rounded-xl h-11 font-semibold shadow-md shadow-primary/20"
                onClick={() => navigate("/orders")}
              >
                View My Orders
              </Button>
              <Button
                id="order-more-btn"
                variant="outline"
                className="flex-1 rounded-xl h-11 font-semibold"
                onClick={() => navigate("/")}
              >
                Order More
              </Button>
            </div>
          </div>

        ) : (
          /* ── Cancelled ── */
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-50 border-2 border-red-200">
                <XCircle className="h-12 w-12 text-destructive" />
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-extrabold text-destructive mb-2">
                Payment Cancelled
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Your payment was not completed and the order has been removed.
                No charges were made.
              </p>
            </div>

            <Button
              id="return-cart-btn"
              className="w-full rounded-xl h-11 font-semibold shadow-md shadow-primary/20"
              onClick={() => navigate("/cart")}
            >
              Return to Cart
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
