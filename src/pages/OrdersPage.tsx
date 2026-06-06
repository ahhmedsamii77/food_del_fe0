import { useState } from "react";
import type { ReactNode } from "react";
import { Package, Clock, CheckCircle, XCircle, Truck, CalendarDays, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserOrders } from "@/lib/hooks";
import { getFoodImageUrl } from "@/lib/api/food.api";

const STATUS_CONFIG: Record<string, { label: string; bg: string; dot: string; icon: ReactNode }> = {
  "Food Processing": {
    label: "Processing",
    bg: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-500",
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  "Out for Delivery": {
    label: "Out for Delivery",
    bg: "bg-blue-50 text-blue-700 border border-blue-200",
    dot: "bg-blue-500",
    icon: <Truck className="h-3.5 w-3.5" />,
  },
  Delivered: {
    label: "Delivered",
    bg: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
    icon: <CheckCircle className="h-3.5 w-3.5" />,
  },
  Cancelled: {
    label: "Cancelled",
    bg: "bg-red-50 text-red-700 border border-red-200",
    dot: "bg-red-500",
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
};

// Order progress steps
const PROGRESS_STEPS = ["Food Processing", "Out for Delivery", "Delivered"];

function OrderProgress({ status }: { status: string }) {
  if (status === "Cancelled") return null;
  const idx = PROGRESS_STEPS.indexOf(status);

  return (
    <div className="flex items-center gap-0 mb-4">
      {PROGRESS_STEPS.map((step, i) => {
        const done = i <= idx;
        const active = i === idx;
        const labels = ["Preparing", "On the Way", "Delivered"];
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  done
                    ? active
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                      : "bg-emerald-500 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {done && !active ? "✓" : i + 1}
              </div>
              <span
                className={`text-[10px] font-medium whitespace-nowrap ${
                  done ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {labels[i]}
              </span>
            </div>
            {i < PROGRESS_STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 mt-[-12px] rounded-full transition-all ${
                  i < idx ? "bg-emerald-500" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

type FilterTab = "all" | "Food Processing" | "Out for Delivery" | "Delivered" | "Cancelled";

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "Food Processing", label: "Processing" },
  { key: "Out for Delivery", label: "Delivering" },
  { key: "Delivered", label: "Delivered" },
  { key: "Cancelled", label: "Cancelled" },
];

export default function OrdersPage() {
  const { data: orders, isLoading } = useGetUserOrders();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const filtered = orders?.filter(
    (o) => activeTab === "all" || o.status === activeTab
  );

  if (isLoading) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-5">
        <Skeleton className="h-8 w-36 mb-6" />
        <Skeleton className="h-12 w-full rounded-2xl" />
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-52 w-full rounded-2xl" />)}
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="h-1 w-6 rounded-full bg-primary" />
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">History</span>
        </div>
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-muted-foreground text-sm mt-1">{orders?.length ?? 0} total orders</p>
      </div>

      {/* Filter tabs */}
      {orders && orders.length > 0 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 mb-6">
          {FILTER_TABS.map(({ key, label }) => {
            const count = key === "all" ? orders.length : orders.filter((o) => o.status === key).length;
            if (count === 0 && key !== "all") return null;
            return (
              <button
                key={key}
                id={`tab-${key}`}
                onClick={() => setActiveTab(key)}
                className={`shrink-0 inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === key
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Filter className="h-3.5 w-3.5" />
                {label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    activeTab === key ? "bg-white/20" : "bg-border"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!orders?.length ? (
        <div className="flex flex-col items-center justify-center py-36 text-center">
          <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
            <Package className="h-10 w-10 text-muted-foreground/40" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
          <p className="text-muted-foreground">Your order history will appear here</p>
        </div>
      ) : filtered?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl mb-4">📦</span>
          <p className="text-muted-foreground">No {activeTab} orders</p>
          <button onClick={() => setActiveTab("all")} className="mt-3 text-sm text-primary hover:underline">
            View all orders
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {filtered?.map((order) => {
            const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG["Food Processing"];
            const orderDate = new Date(order.date).toLocaleDateString("en-US", {
              year: "numeric", month: "short", day: "numeric",
            });
            const totalItems = order.items.reduce((s, i) => s + i.quantity, 0);

            return (
              <article
                key={order._id}
                className="rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden animate-fade-in card-lift"
              >
                {/* Top bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${cfg.dot}`} />
                    <div>
                      <p className="text-sm font-mono font-semibold text-muted-foreground">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <CalendarDays className="h-3 w-3" />
                        {orderDate} · {totalItems} item{totalItems > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-semibold ${cfg.bg}`}>
                      {cfg.icon} {cfg.label}
                    </span>
                    <Badge variant={order.payment ? "default" : "secondary"} className="text-xs rounded-full">
                      {order.payment ? "✓ Paid" : "Unpaid"}
                    </Badge>
                  </div>
                </div>

                {/* Progress tracker */}
                <div className="px-5 pt-4">
                  <OrderProgress status={order.status} />
                </div>

                {/* Items row */}
                <div className="px-5 pb-4">
                  <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 mb-4">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="shrink-0 flex items-center gap-2.5 rounded-xl border border-border/50 bg-muted/40 px-3 py-2"
                      >
                        <div className="h-9 w-9 rounded-lg overflow-hidden bg-muted shrink-0">
                          <img
                            src={getFoodImageUrl(item.image)}
                            alt={item.name}
                            className="h-full w-full object-cover"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                          />
                        </div>
                        <div>
                          <p className="text-xs font-semibold line-clamp-1 max-w-[90px]">{item.name}</p>
                          <p className="text-[11px] text-muted-foreground">×{item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-border/60">
                    <p className="text-sm text-muted-foreground">Order total</p>
                    <p className="text-lg font-extrabold text-primary">{order.amount} EGP</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
