import React, { useState } from "react";
import { useAdminGetAllOrders, useAdminUpdateOrderStatus } from "@/lib/hooks";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Package,
  Search,
  User,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  Loader2,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

const STATUS_OPTIONS = ["Food Processing", "Out for Delivery", "Delivered"];

export default function AdminOrdersPage() {
  const { data: orders, isLoading } = useAdminGetAllOrders();
  const updateStatusMutation = useAdminUpdateOrderStatus();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const handleStatusChange = (orderId: string, status: string) => {
    updateStatusMutation.mutate(
      { orderId, status },
      {
        onSuccess: (res: any) => {
          if (res.data.success) {
            toast.success("Order status updated successfully!");
          } else {
            toast.error(res.data.message || "Failed to update status");
          }
        },
        onError: (err: any) => {
          console.error(err);
          toast.error("Error updating order status");
        },
      }
    );
  };

  const filteredOrders = orders?.filter((order) => {
    const customerName = `${order.address.firstName} ${order.address.lastName}`.toLowerCase();
    const phone = order.address.phone.toLowerCase();
    const matchesSearch =
      customerName.includes(search.toLowerCase()) ||
      phone.includes(search.toLowerCase()) ||
      order._id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders Management</h1>
        <p className="text-sm text-muted-foreground">
          Track and process customer orders, update statuses, and monitor delivery progress.
        </p>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="flex items-center gap-3 bg-card border rounded-2xl p-3 shadow-sm w-full sm:max-w-md">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            id="search-orders-input"
            type="text"
            placeholder="Search by Order ID, name, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-0 text-sm focus:outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0 hidden md:block mr-1" />
          {["All", ...STATUS_OPTIONS].map((status) => (
            <button
              key={status}
              id={`filter-status-${status.replace(/\s+/g, "-")}`}
              onClick={() => setStatusFilter(status)}
              className={[
                "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200",
                statusFilter === status
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                  : "bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground",
              ].join(" ")}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* ── Orders List ── */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="border rounded-2xl p-6 bg-card space-y-4 shadow-sm"
            >
              <div className="flex justify-between items-center pb-4 border-b">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-8 w-1/4 rounded-xl" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredOrders && filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="border rounded-2xl bg-card shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
            >
              {/* Order Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-muted/20 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(order.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                {/* Status Update Control */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status:
                  </span>
                  <select
                    id={`order-status-select-${order._id}`}
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    disabled={updateStatusMutation.isPending}
                    className="h-9 rounded-xl border border-input bg-background px-3 text-xs font-semibold shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Order Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5">
                {/* 1. Items List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Items ({order.items.length})
                  </h4>
                  <ul className="space-y-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin">
                    {order.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between text-sm py-1 border-b border-border/30 last:border-0"
                      >
                        <span className="font-medium text-foreground line-clamp-1">
                          {item.name}
                        </span>
                        <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-md font-semibold">
                          x{item.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. Customer & Address details */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Customer & Delivery
                  </h4>
                  <div className="space-y-2 text-sm text-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="font-semibold">
                        {order.address.firstName} {order.address.lastName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{order.address.phone}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <span className="text-muted-foreground leading-snug">
                        {order.address.street}, {order.address.city}, {order.address.state},{" "}
                        {order.address.country}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Pricing & Payment status */}
                <div className="space-y-3 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Payment & Value
                    </h4>
                    <div className="mt-3 flex items-center justify-between border-b pb-2">
                      <span className="text-sm text-muted-foreground">Payment Status:</span>
                      {order.payment ? (
                        <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10 border-0 rounded-lg">
                          Paid
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/10 border-0 rounded-lg">
                          Cash on Delivery
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm font-semibold">Total Amount:</span>
                      <span className="font-extrabold text-lg text-primary">
                        {order.amount.toLocaleString()} EGP
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
            <Package className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">No orders found</h3>
            <p className="text-sm text-muted-foreground">
              {search || statusFilter !== "All"
                ? "No orders match your filter criteria."
                : "No customer orders have been placed yet."}
            </p>
          </div>
          {(search || statusFilter !== "All") && (
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
              }}
              className="rounded-xl"
            >
              Reset Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
