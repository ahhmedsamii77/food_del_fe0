import { BarChart2, TrendingUp, ShoppingBag, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAnalytics } from "@/lib/hooks";

const STATUS_COLORS: Record<string, string> = {
  "Food Processing": "#f59e0b",
  "Out for Delivery": "#3b82f6",
  "Delivered": "#10b981",
  "Cancelled": "#ef4444",
};

export default function AdminAnalyticsPage() {
  const { data: analytics, isLoading } = useGetAnalytics();

  const maxRevenue = analytics
    ? Math.max(...analytics.revenueByDay.map((d) => d.revenue), 1)
    : 1;

  const totalRevenue = analytics?.revenueByDay.reduce((s, d) => s + d.revenue, 0) ?? 0;
  const totalOrders = analytics?.revenueByDay.reduce((s, d) => s + d.count, 0) ?? 0;
  const statusTotal = analytics?.ordersByStatus.reduce((s, d) => s + d.count, 0) ?? 1;

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="h-1 w-6 rounded-full bg-primary" />
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Insights</span>
        </div>
        <h1 className="text-3xl font-extrabold">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Last 14 days overview</p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
        ) : (
          <>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-emerald-700">Revenue (14 days)</p>
                <p className="text-2xl font-extrabold text-emerald-800">{totalRevenue.toLocaleString()} EGP</p>
              </div>
            </div>
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-primary/80">Paid Orders (14 days)</p>
                <p className="text-2xl font-extrabold text-primary">{totalOrders}</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Revenue Chart */}
      <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden mb-6">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
          <BarChart2 className="h-4 w-4 text-primary" />
          <h2 className="font-semibold">Daily Revenue</h2>
        </div>

        {isLoading ? (
          <div className="h-56 p-5 flex items-end gap-2">
            {Array.from({ length: 14 }).map((_, i) => (
              <Skeleton key={i} className="flex-1 rounded-t-lg" style={{ height: `${30 + Math.random() * 70}%` }} />
            ))}
          </div>
        ) : (
          <div className="p-5">
            {/* Bar chart */}
            <div className="flex items-end gap-1 h-44">
              {analytics?.revenueByDay.map((day) => {
                const heightPct = (day.revenue / maxRevenue) * 100;
                const label = new Date(day.date).toLocaleDateString("en-US", { day: "numeric", month: "short" });
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-1 group">
                    <div className="relative w-full flex items-end justify-center" style={{ height: "160px" }}>
                      {/* Tooltip */}
                      {day.revenue > 0 && (
                        <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-[10px] font-semibold rounded px-1.5 py-0.5 pointer-events-none whitespace-nowrap z-10">
                          {day.revenue} EGP
                        </div>
                      )}
                      <div
                        className="w-full rounded-t-md transition-all duration-500"
                        style={{
                          height: `${Math.max(heightPct, day.revenue > 0 ? 4 : 0)}%`,
                          background: day.revenue > 0
                            ? "linear-gradient(to top, oklch(55% 0.22 30), oklch(75% 0.20 50))"
                            : "oklch(0.91 0.01 60)",
                        }}
                      />
                    </div>
                    <span className="text-[9px] text-muted-foreground rotate-45 origin-left ml-1 hidden sm:block">{label}</span>
                  </div>
                );
              })}
            </div>
            {/* X axis labels mobile */}
            <div className="flex justify-between mt-2 sm:hidden">
              <span className="text-[10px] text-muted-foreground">
                {analytics?.revenueByDay[0]?.date.slice(5)}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {analytics?.revenueByDay[analytics.revenueByDay.length - 1]?.date.slice(5)}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Orders by status — donut-like progress bars */}
        <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
            <ShoppingBag className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">Orders by Status</h2>
          </div>
          <div className="p-5 space-y-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 rounded-lg" />)
              : analytics?.ordersByStatus.map(({ status, count }) => {
                  const pct = Math.round((count / statusTotal) * 100);
                  const color = STATUS_COLORS[status] ?? "#6b7280";
                  return (
                    <div key={status}>
                      <div className="flex justify-between text-xs font-medium mb-1.5">
                        <span style={{ color }}>{status}</span>
                        <span className="text-muted-foreground">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>

        {/* Top selling items */}
        <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
            <Award className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">Top Selling Items</h2>
          </div>
          <div className="p-5 space-y-3">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)
              : !analytics?.topItems.length
              ? (
                <div className="text-center py-10">
                  <Award className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No sales data yet</p>
                </div>
              )
              : analytics.topItems.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors">
                    {/* Rank badge */}
                    <div className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 ${
                      i === 0 ? "bg-amber-100 text-amber-700" :
                      i === 1 ? "bg-slate-100 text-slate-600" :
                      i === 2 ? "bg-orange-100 text-orange-700" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.quantity} sold</p>
                    </div>
                    <span className="text-sm font-bold text-primary shrink-0">{item.revenue} EGP</span>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
