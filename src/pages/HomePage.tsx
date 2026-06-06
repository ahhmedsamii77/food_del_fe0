import { useState, useMemo } from "react";
import { Search, Flame, Clock, Star, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import FoodCard, { FoodCardSkeleton } from "@/components/FoodCard";
import CategoryFilter from "@/components/CategoryFilter";
import { useGetFoods, useGetCart } from "@/lib/hooks";
import { useNavigate } from "react-router-dom";

/* ── Stats strip ── */
const STATS = [
  { icon: Flame, label: "Hot Deals", value: "20+ daily" },
  { icon: Clock, label: "Avg. Delivery", value: "30 min" },
  { icon: Star, label: "Customer Rating", value: "4.8 / 5" },
];

const HOW_IT_WORKS = [
  { emoji: "🔍", step: "01", title: "Browse Menu", desc: "Explore dozens of fresh dishes across multiple categories." },
  { emoji: "🛒", step: "02", title: "Add to Cart", desc: "Pick your favourites, choose quantities, and review your order." },
  { emoji: "🚀", step: "03", title: "Get Delivered", desc: "Pay securely and receive your hot meal in under 35 minutes." },
];

const TESTIMONIALS = [
  { name: "Sarah M.", avatar: "S", rating: 5, text: "The food arrives hot and fresh every single time. FoodDel is now my go-to for lunch!", role: "Regular Customer" },
  { name: "Ahmed K.", avatar: "A", rating: 5, text: "Incredibly fast delivery and the portions are generous. Highly recommend the pasta!", role: "Food Enthusiast" },
  { name: "Nour T.", avatar: "N", rating: 5, text: "Best food delivery app in Cairo. The interface is clean and ordering takes 30 seconds.", role: "Daily User" },
];

const CATEGORIES = [
  { emoji: "🍕", name: "Pizza" },
  { emoji: "🍔", name: "Burgers" },
  { emoji: "🥗", name: "Salads" },
  { emoji: "🌯", name: "Wraps" },
  { emoji: "🍝", name: "Pasta" },
  { emoji: "🎂", name: "Desserts" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const { data: foods, isLoading: foodsLoading } = useGetFoods();
  const { data: cartItems } = useGetCart();

  const cartMap = useMemo(() => {
    const map: Record<string, import("@/types").CartItem> = {};
    cartItems?.forEach((item) => { map[item._id] = item; });
    return map;
  }, [cartItems]);

  const filtered = useMemo(() => {
    if (!foods) return [];
    return foods.filter((f) => {
      const matchCat = category === "all" || f.category === category;
      const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [foods, category, search]);

  return (
    <main>
      {/* ════════════════ HERO ════════════════ */}
      <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top_left,oklch(95%_0.06_60),oklch(98%_0.01_60)_50%,oklch(97%_0.04_30))]">
        <div aria-hidden className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute top-12 right-0 h-72 w-72 rounded-full bg-orange-300/20 blur-3xl" />

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
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-7 py-3.5 text-base font-semibold hover:border-primary/40 hover:bg-accent transition-all"
                >
                  Learn More
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Right emoji grid */}
            <div className="hidden md:flex items-center justify-center">
              <div className="grid grid-cols-3 gap-5">
                {[
                  { e: "🍕", delay: "0s" }, { e: "🍔", delay: "0.3s" }, { e: "🌯", delay: "0.6s" },
                  { e: "🥗", delay: "0.9s" }, { e: "🍜", delay: "1.2s" }, { e: "🎂", delay: "1.5s" },
                  { e: "🍰", delay: "0.4s" }, { e: "🥪", delay: "0.7s" }, { e: "🍝", delay: "1.0s" },
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
              <div key={label} className="flex items-center gap-4 rounded-2xl border border-border/60 bg-white/70 backdrop-blur-sm px-5 py-4 shadow-sm">
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

      {/* ════════════════ FEATURED CATEGORIES ════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-4">
        <div className="flex items-center gap-2 mb-6">
          <span className="h-1 w-6 rounded-full bg-primary" />
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Browse by Category</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {CATEGORIES.map(({ emoji, name }) => (
            <button
              key={name}
              id={`cat-${name.toLowerCase()}`}
              onClick={() => {
                setCategory(name);
                document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border/50 bg-card hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm transition-all group cursor-pointer"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform duration-200">{emoji}</span>
              <span className="text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">{name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ════════════════ HOW IT WORKS ════════════════ */}
      <section className="bg-muted/40 py-16 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="h-1 w-6 rounded-full bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Simple Process</span>
              <span className="h-1 w-6 rounded-full bg-primary" />
            </div>
            <h2 className="text-3xl font-bold">How it works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map(({ emoji, step, title, desc }, i) => (
              <div key={title} className="relative text-center animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-white border border-border/50 shadow-sm mb-4 mx-auto text-4xl">
                  {emoji}
                </div>
                <span className="absolute top-0 right-1/4 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-extrabold flex items-center justify-center">
                  {step}
                </span>
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ MENU ════════════════ */}
      <section id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1 w-6 rounded-full bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Our Menu</span>
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
            {Array.from({ length: 8 }).map((_, i) => <FoodCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <span className="text-7xl mb-5">🍽️</span>
            <h3 className="text-xl font-bold mb-2">No dishes found</h3>
            <p className="text-muted-foreground text-sm">Try a different category or search term</p>
            <button onClick={() => { setCategory("all"); setSearch(""); }} className="mt-4 text-sm text-primary hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((food) => (
              <FoodCard key={food._id} food={food} cartItem={cartMap[food._id]} />
            ))}
          </div>
        )}
      </section>

      {/* ════════════════ TESTIMONIALS ════════════════ */}
      <section className="bg-linear-to-br from-primary/5 to-orange-50 dark:from-primary/10 dark:to-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="h-1 w-6 rounded-full bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Reviews</span>
              <span className="h-1 w-6 rounded-full bg-primary" />
            </div>
            <h2 className="text-3xl font-bold">What our customers say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, avatar, rating, text, role }, i) => (
              <div
                key={name}
                className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm card-lift animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: rating }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">"{text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                  <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-primary-foreground">{avatar}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{name}</p>
                    <p className="text-xs text-muted-foreground">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ CTA Banner ════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="rounded-3xl bg-linear-to-r from-primary to-orange-400 p-10 text-center relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div aria-hidden className="pointer-events-none absolute bottom-0 left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <h2 className="text-3xl font-extrabold text-white mb-3">Ready to order?</h2>
          <p className="text-white/80 mb-7 text-base">Fresh food, fast delivery. Start exploring our menu now.</p>
          <button
            onClick={() => navigate("/auth/register")}
            className="inline-flex items-center gap-2 rounded-xl bg-white text-primary px-8 py-3.5 text-base font-bold shadow-lg hover:bg-white/90 transition-all active:scale-95"
          >
            Get Started — It's Free
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </main>
  );
}
