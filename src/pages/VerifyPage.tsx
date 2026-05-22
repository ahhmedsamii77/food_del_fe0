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
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center animate-fade-in">
        {isPending ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
            </div>
            <h2 className="text-2xl font-bold">Verifying payment...</h2>
            <p className="text-muted-foreground">Please wait while we confirm your order</p>
          </div>
        ) : isPaymentSuccess ? (
          <div className="space-y-5">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-green-600 mb-2">Order Confirmed!</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your payment was successful. Your food is being prepared and will be delivered soon 🍕
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate("/orders")} size="lg">View My Orders</Button>
              <Button variant="outline" onClick={() => navigate("/")} size="lg">Order More</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="h-12 w-12 text-destructive" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-destructive mb-2">Payment Cancelled</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your payment was not completed and the order has been removed. No charges were made.
              </p>
            </div>
            <Button onClick={() => navigate("/cart")} size="lg">Return to Cart</Button>
          </div>
        )}
      </div>
    </main>
  );
}
