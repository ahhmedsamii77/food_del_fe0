import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import FoodCard, { FoodCardSkeleton } from "@/components/FoodCard";
import CategoryFilter from "@/components/CategoryFilter";
import { useGetFoods, useGetCart } from "@/lib/hooks";

export default function HomePage() {
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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <section className="relative rounded-3xl overflow-hidden mb-10 bg-linear-to-br from-primary/90 to-indigo-600 p-8 md:p-12 text-white">
        <div className="relative z-10 max-w-xl">
          <p className="text-primary-foreground/80 text-sm font-medium mb-2 tracking-wide uppercase">
            Fast & Fresh Delivery
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Order your <br />
            <span className="text-yellow-300">favourite food</span> here
          </h1>
          <p className="text-primary-foreground/80 mb-6 leading-relaxed">
            Choose from our diverse menu featuring a delectable array of dishes. 
            Satisfy your cravings and fuel your body.
          </p>
          <a
            href="#menu"
            className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-full hover:bg-yellow-50 transition-colors shadow-lg"
          >
            🍽️ Explore Menu
          </a>
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-white/10" />
        <div className="absolute right-16 bottom-4 h-24 w-24 rounded-full bg-white/5" />
      </section>

      {/* Menu section */}
      <section id="menu">
        <h2 className="text-2xl font-bold mb-1">Our Menu</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Choose what you love from our fresh selection
        </p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <CategoryFilter selected={category} onChange={setCategory} />
          <div className="relative sm:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search dishes..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Grid */}
        {foodsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <FoodCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-6xl mb-4">🍽️</span>
            <h3 className="text-lg font-semibold mb-1">No dishes found</h3>
            <p className="text-muted-foreground text-sm">
              Try a different category or search term
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((food) => (
              <FoodCard key={food._id} food={food} cartItem={cartMap[food._id]} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
