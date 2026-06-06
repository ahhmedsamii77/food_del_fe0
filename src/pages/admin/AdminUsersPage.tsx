import { useState } from "react";
import { Users, Search, Shield, UserIcon, CheckCircle, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminGetAllUsers } from "@/lib/hooks";

export default function AdminUsersPage() {
  const { data: users, isLoading } = useAdminGetAllUsers();
  const [search, setSearch] = useState("");

  const filtered = users?.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-1 w-6 rounded-full bg-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Management</span>
          </div>
          <h1 className="text-3xl font-extrabold">Users</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {users?.length ?? 0} registered accounts
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id="admin-users-search"
            placeholder="Search users…"
            className="pl-9 h-10 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: "Total Users",
            value: users?.length ?? 0,
            icon: Users,
            color: "bg-primary/10 text-primary",
          },
          {
            label: "Admins",
            value: users?.filter((u) => u.role === "admin").length ?? 0,
            icon: Shield,
            color: "bg-amber-50 text-amber-600",
          },
          {
            label: "Verified",
            value: users?.filter((u) => u.confirmedAt).length ?? 0,
            icon: CheckCircle,
            color: "bg-emerald-50 text-emerald-600",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-border/60 bg-card p-5 flex items-center gap-4 shadow-sm">
            <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-2xl font-extrabold">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
          <Users className="h-4 w-4 text-primary" />
          <h2 className="font-semibold">All Users</h2>
        </div>

        {isLoading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-xl" />
            ))}
          </div>
        ) : !filtered?.length ? (
          <div className="flex flex-col items-center py-16 text-center">
            <UserIcon className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">User</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Email</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Role</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    {/* Avatar + name */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-primary">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-3.5 text-muted-foreground">{user.email}</td>

                    {/* Role */}
                    <td className="px-5 py-3.5">
                      <Badge
                        variant={user.role === "admin" ? "default" : "secondary"}
                        className="rounded-full text-xs capitalize gap-1"
                      >
                        {user.role === "admin" && <Shield className="h-3 w-3" />}
                        {user.role}
                      </Badge>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      {user.confirmedAt ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">
                          <CheckCircle className="h-3 w-3" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5">
                          <Clock className="h-3 w-3" />
                          Pending
                        </span>
                      )}
                    </td>

                    {/* Joined */}
                    <td className="px-5 py-3.5 text-muted-foreground text-xs">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-US", {
                            year: "numeric", month: "short", day: "numeric",
                          })
                        : "—"}
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
