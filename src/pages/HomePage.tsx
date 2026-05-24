import { useState, useMemo } from "react";
import { Search, Flame, Clock, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import FoodCard, { FoodCardSkeleton } from "@/components/FoodCard";
import CategoryFilter from "@/components/CategoryFilter";
import { useGetFoods, useGetCart } from "@/lib/hooks";

/* ── Stats strip ── */
const STATS = [
  { icon: Flame, label: "Hot Deals", value: "20+ daily" },
  { icon: Clock, label: "Avg. Delivery", value: "30 min" },
  { icon: Star, label: "Customer Rating", value: "4.8 / 5" },
];

export default function HomePage() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const { data: foods, isLoading: foodsLoading } = useGetFoods();
  const { data: cartItems } = useGetCart();

  const cartMap = useMemo(() => {
    const map: Record<string, import("@/types").CartItem> = {};
    cartItems?.forEach((item) => {
      map[item._id] = item;
    });
    return map;
  }, [cartItems]);

  const filtered = useMemo(() => {
    if (!foods) return [];
    return foods.filter((f) => {
      const matchCat = category === "all" || f.category === category;
      const matchSearch = f.name
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [foods, category, search]);

  return (
    <main>
      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top_left,oklch(95%_0.06_60),oklch(98%_0.01_60)_50%,oklch(97%_0.04_30))]">
        {/* Decorative blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-12 right-0 h-72 w-72 rounded-full bg-orange-300/20 blur-3xl"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left copy */}
            <div className="animate-fade-in">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary mb-5">
                🍕 &nbsp;Fast &amp; Fresh — Delivered to Your Door
              </span>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight text-foreground">
                Hungry?{" "}
                <span className="text-gradient-orange">Order</span>
                <br />
                in seconds.
              </h1>

              <p className="mt-5 text-muted-foreground text-lg leading-relaxed max-w-md">
                Explore our diverse menu — from fresh salads to indulgent
                desserts — and get it delivered hot and fast.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  id="hero-explore-btn"
                  href="#menu"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all hover:shadow-primary/50 hover:shadow-xl active:scale-95"
                >
                  🍽️&nbsp; Explore Menu
                </a>
                <a
                  href="#menu"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-7 py-3.5 text-base font-semibold hover:border-primary/40 hover:bg-accent transition-all"
                >
                  See Offers
                </a>
              </div>
            </div>

            {/* Right emoji grid */}
            <div className="hidden md:flex items-center justify-center">
              <div className="grid grid-cols-3 gap-5">
                {[
                  { e: "🍕", delay: "0s" },
                  { e: "🍔", delay: "0.3s" },
                  { e: "🌯", delay: "0.6s" },
                  { e: "🥗", delay: "0.9s" },
                  { e: "🍜", delay: "1.2s" },
                  { e: "🎂", delay: "1.5s" },
                  { e: "🍰", delay: "0.4s" },
                  { e: "🥪", delay: "0.7s" },
                  { e: "🍝", delay: "1.0s" },
                ].map(({ e, delay }) => (
                  <div
                    key={e}
                    className="h-20 w-20 flex items-center justify-center rounded-2xl bg-white border border-border/60 shadow-sm animate-float text-4xl"
                    style={{ animationDelay: delay }}
                  >
                    {e}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {STATS.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-4 rounded-2xl border border-border/60 bg-white/70 backdrop-blur-sm px-5 py-4 shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-bold">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          MENU
      ════════════════════════════════════════ */}
      <section
        id="menu"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1 w-6 rounded-full bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Our Menu
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">
              What would you like{" "}
              <span className="text-gradient-orange">today?</span>
            </h2>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="menu-search"
              placeholder="Search dishes…"
              className="pl-9 h-10 rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Category filter */}
        <div className="mb-8">
          <CategoryFilter selected={category} onChange={setCategory} />
        </div>

        {/* Grid */}
        {foodsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <FoodCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <span className="text-7xl mb-5">🍽️</span>
            <h3 className="text-xl font-bold mb-2">No dishes found</h3>
            <p className="text-muted-foreground text-sm">
              Try a different category or search term
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((food) => (
              <FoodCard
                key={food._id}
                food={food}
                cartItem={cartMap[food._id]}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
