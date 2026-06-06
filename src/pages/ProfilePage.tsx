import { useState, useEffect } from "react";
import {
  
  Mail,
  Edit3,
  CheckCircle,
  ShoppingBag,
  TrendingUp,
  Package,
  Save,
  X,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useGetMe, useUpdateProfile, useGetUserOrders } from "@/lib/hooks";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: user, isLoading: userLoading } = useGetMe();
  const { data: orders, isLoading: ordersLoading } = useGetUserOrders();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);

  const handleSave = () => {
    if (!name.trim()) return toast.error("Name is required");
    updateProfile(
      { name: name.trim() },
      {
        onSuccess: () => {
          toast.success("Profile updated!");
          setEditing(false);
        },
        onError: (err: any) =>
          toast.error(err?.response?.data?.message || "Failed to update"),
      }
    );
  };

  const totalSpent = orders?.filter((o) => o.payment).reduce((s, o) => s + o.amount, 0) ?? 0;
  const delivered = orders?.filter((o) => o.status === "Delivered").length ?? 0;
  const pending = orders?.filter((o) => o.status === "Food Processing").length ?? 0;
  const delivering = orders?.filter((o) => o.status === "Out for Delivery").length ?? 0;

  const stats = [
    { label: "Total Orders", value: orders?.length ?? 0, icon: ShoppingBag, color: "bg-primary/10 text-primary" },
    { label: "Total Spent", value: `${totalSpent.toLocaleString()} EGP`, icon: TrendingUp, color: "bg-emerald-50 text-emerald-600" },
    { label: "Delivered", value: delivered, icon: CheckCircle, color: "bg-blue-50 text-blue-600" },
    { label: "Pending", value: pending, icon: Package, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="h-1 w-6 rounded-full bg-primary" />
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Account</span>
        </div>
        <h1 className="text-3xl font-bold">My Profile</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Profile card ── */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden animate-fade-in">
            {/* Avatar band */}
            <div className="h-20 bg-linear-to-br from-primary/80 to-orange-400" />
            <div className="px-6 pb-6">
              <div className="-mt-8 mb-4">
                <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center ring-4 ring-card shadow-lg">
                  <span className="text-2xl font-extrabold text-primary-foreground">
                    {user?.name?.charAt(0).toUpperCase() ?? "?"}
                  </span>
                </div>
              </div>

              {userLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-lg font-bold">{user?.name}</h2>
                    <Badge variant={user?.role === "admin" ? "default" : "secondary"} className="rounded-full text-xs capitalize">
                      {user?.role}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    {user?.email}
                  </p>
                  {user?.confirmedAt && (
                    <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1.5">
                      <CheckCircle className="h-3 w-3" />
                      Email verified
                    </p>
                  )}
                </>
              )}

              <Separator className="my-4" />

              {/* Edit name */}
              {editing ? (
                <div className="space-y-3">
                  <Label htmlFor="profile-name" className="text-xs text-muted-foreground">Display Name</Label>
                  <Input
                    id="profile-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-9 rounded-xl"
                    onKeyDown={(e) => e.key === "Enter" && handleSave()}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button
                      id="profile-save-btn"
                      size="sm"
                      className="flex-1 rounded-xl gap-1.5"
                      onClick={handleSave}
                      disabled={isPending}
                    >
                      <Save className="h-3.5 w-3.5" />
                      {isPending ? "Saving…" : "Save"}
                    </Button>
                    <Button
                      id="profile-cancel-btn"
                      size="sm"
                      variant="outline"
                      className="rounded-xl"
                      onClick={() => { setEditing(false); setName(user?.name ?? ""); }}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  id="profile-edit-btn"
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl gap-2"
                  onClick={() => setEditing(true)}
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit Name
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* ── Stats & Orders ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {ordersLoading
              ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
              : stats.map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm flex items-center gap-3 animate-fade-in">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-xl font-extrabold mt-0.5">{value}</p>
                    </div>
                  </div>
                ))}
          </div>

          {/* Recent Orders */}
          <div className="rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
              <ShoppingBag className="h-4 w-4 text-primary" />
              <h2 className="font-semibold text-base">Recent Orders</h2>
            </div>

            {ordersLoading ? (
              <div className="p-5 space-y-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
              </div>
            ) : !orders?.length ? (
              <div className="flex flex-col items-center py-10 text-center">
                <Package className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">No orders yet</p>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {orders.slice(0, 5).map((order) => {
                  const statusColor =
                    order.status === "Delivered" ? "text-emerald-600" :
                    order.status === "Out for Delivery" ? "text-blue-600" :
                    order.status === "Cancelled" ? "text-red-500" : "text-amber-600";
                  const StatusIcon =
                    order.status === "Delivered" ? CheckCircle :
                    order.status === "Out for Delivery" ? Truck :
                    Package;

                  return (
                    <div key={order._id} className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center bg-muted ${statusColor}`}>
                          <StatusIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-mono font-semibold text-muted-foreground">
                            #{order._id.slice(-8).toUpperCase()}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {order.items.reduce((s, i) => s + i.quantity, 0)} items
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary text-sm">{order.amount} EGP</p>
                        <p className={`text-xs font-medium ${statusColor}`}>{order.status}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active delivery strip */}
          {delivering > 0 && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 flex items-center gap-3 animate-fade-in">
              <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <Truck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-blue-800 text-sm">
                  {delivering} order{delivering > 1 ? "s" : ""} on the way!
                </p>
                <p className="text-xs text-blue-600">Your food is being delivered right now 🚀</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
