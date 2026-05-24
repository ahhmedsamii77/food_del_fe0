import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowRight,
  MapPin,
  ReceiptText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCart, useUpdateCartQuantity, usePlaceOrder } from "@/lib/hooks";
import { getFoodImageUrl } from "@/lib/api/food.api";
import { toast } from "sonner";
import type { DeliveryAddress } from "@/types";

const DELIVERY_FEE = 50;

const ADDRESS_FIELDS: {
  key: keyof DeliveryAddress;
  label: string;
  type: string;
  span?: boolean;
}[] = [
  { key: "firstName",  label: "First Name",      type: "text" },
  { key: "lastName",   label: "Last Name",        type: "text" },
  { key: "email",      label: "Email",            type: "email" },
  { key: "phone",      label: "Phone",            type: "tel" },
  { key: "street",     label: "Street Address",   type: "text", span: true },
  { key: "city",       label: "City",             type: "text" },
  { key: "state",      label: "State / Province", type: "text" },
  { key: "zipCode",    label: "ZIP Code",         type: "text" },
  { key: "country",    label: "Country",          type: "text" },
];

export default function CartPage() {
  const navigate = useNavigate();
  const { data: cartItems, isLoading } = useGetCart();
  const { mutate: updateQty } = useUpdateCartQuantity();
  const { mutate: placeOrder, isPending: isOrdering } = usePlaceOrder();

  const [address, setAddress] = useState<DeliveryAddress>({
    firstName: "", lastName: "", email: "", street: "",
    city: "", state: "", zipCode: "", country: "", phone: "",
  });

  const subtotal =
    cartItems?.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0;
  const total = subtotal + DELIVERY_FEE;

  const handleQty = (itemId: string, qty: number) => {
    updateQty(
      { itemId, quantity: qty },
      { onError: () => toast.error("Failed to update quantity") },
    );
  };

  const handleCheckout = () => {
    if (!cartItems?.length) return toast.error("Your cart is empty");
    const required: (keyof DeliveryAddress)[] = [
      "firstName", "lastName", "email", "street", "city", "phone",
    ];
    for (const key of required) {
      if (!address[key])
        return toast.error(`Please fill in "${key}"`);
    }
    placeOrder(
      { items: cartItems, amount: total, address },
      {
        onSuccess: (res) => {
          if (res.data.success && res.data.session_url)
            window.location.href = res.data.session_url;
        },
        onError: (err: any) =>
          toast.error(err?.response?.data?.message || "Order failed"),
      },
    );
  };

  /* ── Loading ── */
  if (isLoading) {
    return (
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Skeleton className="h-8 w-40 mb-8" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 w-full rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </main>
    );
  }

  /* ── Empty ── */
  if (!cartItems?.length) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col items-center justify-center py-36 text-center">
          <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
            <ShoppingCart className="h-10 w-10 text-muted-foreground/40" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-7">
            Add some delicious items to get started
          </p>
          <Button
            id="browse-menu-btn"
            onClick={() => navigate("/")}
            className="rounded-xl px-7"
          >
            Browse Menu
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <ShoppingCart className="h-7 w-7 text-primary" />
        Your Cart
        <span className="ml-1 text-lg text-muted-foreground font-normal">
          ({cartItems.length} item{cartItems.length > 1 ? "s" : ""})
        </span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* ── Left column ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Cart item rows */}
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex gap-4 items-center rounded-2xl border border-border/50 bg-card p-4 shadow-sm animate-fade-in"
            >
              {/* Thumb */}
              <div className="h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-muted">
                <img
                  src={getFoodImageUrl(item.image)}
                  alt={item.name}
                  className="h-full w-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate text-[15px]">{item.name}</p>
                <p className="text-primary font-bold mt-0.5">{item.price} EGP</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Subtotal:{" "}
                  <span className="text-foreground font-medium">
                    {item.price * item.quantity} EGP
                  </span>
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  id={`cart-dec-${item._id}`}
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-xl border-border"
                  onClick={() => handleQty(item._id, item.quantity - 1)}
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <span className="font-bold w-6 text-center tabular-nums text-sm">
                  {item.quantity}
                </span>
                <Button
                  id={`cart-inc-${item._id}`}
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-xl border-border"
                  onClick={() => handleQty(item._id, item.quantity + 1)}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
                <Button
                  id={`cart-del-${item._id}`}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-xl text-destructive hover:bg-destructive/8 ml-1"
                  onClick={() => handleQty(item._id, 0)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}

          {/* Delivery address */}
          <div className="rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
              <MapPin className="h-4 w-4 text-primary" />
              <h2 className="font-semibold text-base">Delivery Address</h2>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ADDRESS_FIELDS.map(({ key, label, type, span }) => (
                <div key={key} className={span ? "sm:col-span-2" : ""}>
                  <Label
                    htmlFor={`addr-${key}`}
                    className="text-xs font-medium text-muted-foreground mb-1.5 block"
                  >
                    {label}
                  </Label>
                  <Input
                    id={`addr-${key}`}
                    type={type}
                    className="h-10 rounded-xl"
                    value={address[key]}
                    onChange={(e) =>
                      setAddress((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Order summary ── */}
        <div>
          <div className="sticky top-24 rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
              <ReceiptText className="h-4 w-4 text-primary" />
              <h2 className="font-semibold text-base">Order Summary</h2>
            </div>

            <div className="p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Subtotal ({cartItems.length} items)
                </span>
                <span className="font-medium">{subtotal} EGP</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery fee</span>
                <span className="font-medium">{DELIVERY_FEE} EGP</span>
              </div>
              <Separator className="my-1" />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-primary text-lg">{total} EGP</span>
              </div>
            </div>

            <div className="px-5 pb-5">
              <Button
                id="checkout-btn"
                className="w-full rounded-xl gap-2 h-12 text-base shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35"
                size="lg"
                onClick={handleCheckout}
                disabled={isOrdering}
              >
                {isOrdering ? (
                  "Processing…"
                ) : (
                  <>
                    Proceed to Payment
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground mt-3">
                🔒 Secure checkout via Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
