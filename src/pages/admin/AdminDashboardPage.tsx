import { useAdminGetAllOrders, useGetFoods } from "@/lib/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingBag,
  UtensilsCrossed,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  DollarSign,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { data: orders, isLoading: ordersLoading } = useAdminGetAllOrders();
  const { data: foods, isLoading: foodsLoading } = useGetFoods();

  const totalRevenue =
    orders?.filter((o) => o.payment).reduce((s, o) => s + o.amount, 0) ?? 0;
  const pending = orders?.filter((o) => o.status === "Food Processing").length ?? 0;
  const delivering = orders?.filter((o) => o.status === "Out for Delivery").length ?? 0;
  const delivered = orders?.filter((o) => o.status === "Delivered").length ?? 0;

  const stats = [
    {
      label: "Total Revenue",
      value: `${totalRevenue.toLocaleString()} EGP`,
      icon: DollarSign,
      color: "bg-emerald-50 text-emerald-600",
      border: "border-emerald-100",
    },
    {
      label: "Total Orders",
      value: orders?.length ?? 0,
      icon: ShoppingBag,
      color: "bg-primary/10 text-primary",
      border: "border-primary/20",
    },
    {
      label: "Menu Items",
      value: foods?.length ?? 0,
      icon: UtensilsCrossed,
      color: "bg-amber-50 text-amber-600",
      border: "border-amber-100",
    },
    {
      label: "Paid Orders",
      value: orders?.filter((o) => o.payment).length ?? 0,
      icon: TrendingUp,
      color: "bg-blue-50 text-blue-600",
      border: "border-blue-100",
    },
  ];

  const statusCards = [
    { label: "Processing", count: pending,    icon: Clock,         dot: "bg-amber-500" },
    { label: "Delivering", count: delivering, icon: Truck,         dot: "bg-blue-500" },
    { label: "Delivered",  count: delivered,  icon: CheckCircle,   dot: "bg-emerald-500" },
  ];

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="h-1 w-6 rounded-full bg-primary" />
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Overview
          </span>
        </div>
        <h1 className="text-3xl font-extrabold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back, Admin! Here's what's happening today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {ordersLoading || foodsLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))
          : stats.map(({ label, value, icon: Icon, color, border }) => (
              <div
                key={label}
                className={`rounded-2xl border ${border} bg-card p-5 flex items-center gap-4 shadow-sm`}
              >
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-2xl font-extrabold mt-0.5">{value}</p>
                </div>
              </div>
            ))}
      </div>

      {/* Status breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {statusCards.map(({ label, count, icon: Icon, dot }) => (
          <div
            key={label}
            className="rounded-2xl border border-border/60 bg-card p-5 flex items-center gap-4 shadow-sm"
          >
            <span className={`h-3 w-3 rounded-full shrink-0 ${dot}`} />
            <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-xl font-bold">{count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-semibold">Recent Orders</h2>
          <span className="text-xs text-muted-foreground">Last 10</span>
        </div>
        {ordersLoading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Order ID</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Items</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Total</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Payment</th>
                </tr>
              </thead>
              <tbody>
                {orders?.slice(0, 10).map((order) => (
                  <tr key={order._id} className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-5 py-3">
                      {order.items.reduce((s, i) => s + i.quantity, 0)} items
                    </td>
                    <td className="px-5 py-3 font-semibold text-primary">
                      {order.amount} EGP
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-muted text-muted-foreground">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${order.payment ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                        {order.payment ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
