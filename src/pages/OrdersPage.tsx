import type { ReactNode } from "react";
import { Package, Clock, CheckCircle, XCircle, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserOrders } from "@/lib/hooks";
import { getFoodImageUrl } from "@/lib/api/food.api";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: ReactNode }> = {
  "Food Processing": { label: "Processing", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", icon: <Clock className="h-3 w-3" /> },
  "Out for Delivery": { label: "Out for Delivery", color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: <Truck className="h-3 w-3" /> },
  "Delivered": { label: "Delivered", color: "bg-green-500/10 text-green-600 border-green-500/20", icon: <CheckCircle className="h-3 w-3" /> },
  "Cancelled": { label: "Cancelled", color: "bg-destructive/10 text-destructive border-destructive/20", icon: <XCircle className="h-3 w-3" /> },
};

export default function OrdersPage() {
  const { data: orders, isLoading } = useGetUserOrders();

  if (isLoading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-8 w-32 mb-6" />
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-40 w-full rounded-xl" />)}
      </main>
    );
  }

  if (!orders?.length) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <Package className="h-20 w-20 text-muted-foreground/20 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
          <p className="text-muted-foreground">Your order history will appear here</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      <div className="space-y-5">
        {orders.map((order) => {
          const statusCfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG["Food Processing"];
          return (
            <Card key={order._id} className="border-border/50 hover:border-primary/20 hover:shadow-md transition-all duration-200 animate-fade-in">
              <CardHeader className="pb-3 flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-sm font-mono text-muted-foreground">
                    #{order._id.slice(-8).toUpperCase()}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(order.date).toLocaleDateString("en-US", {
                      year: "numeric", month: "short", day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${statusCfg.color}`}>
                    {statusCfg.icon}
                    {statusCfg.label}
                  </span>
                  <Badge variant={order.payment ? "default" : "secondary"} className="text-xs">
                    {order.payment ? "✓ Paid" : "Unpaid"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Items */}
                <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="shrink-0 flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
                      <div className="h-8 w-8 rounded overflow-hidden bg-muted">
                        <img
                          src={getFoodImageUrl(item.image)}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                      </div>
                      <div>
                        <p className="text-xs font-medium line-clamp-1 max-w-[100px]">{item.name}</p>
                        <p className="text-xs text-muted-foreground">×{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {order.items.reduce((sum, i) => sum + i.quantity, 0)} item(s)
                  </p>
                  <p className="font-bold text-primary">{order.amount} EGP</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
