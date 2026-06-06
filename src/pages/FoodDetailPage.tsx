import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  Tag,
  Star,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useGetFoodById, useGetFoods, useGetCart, useAddToCart, useUpdateCartQuantity } from "@/lib/hooks";
import { getFoodImageUrl } from "@/lib/api/food.api";
import { useAuthStore } from "@/lib/store/auth";
import { toast } from "sonner";
import FoodCard from "@/components/FoodCard";

export default function FoodDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { access_Token } = useAuthStore();

  const { data: food, isLoading } = useGetFoodById(id ?? "");
  const { data: allFoods } = useGetFoods();
  const { data: cartItems } = useGetCart();
  const { mutate: addToCart } = useAddToCart();
  const { mutate: updateQty } = useUpdateCartQuantity();

  const cartMap = useMemo(() => {
    const map: Record<string, import("@/types").CartItem> = {};
    cartItems?.forEach((item) => { map[item._id] = item; });
    return map;
  }, [cartItems]);

  const cartItem = food ? cartMap[food._id] : undefined;
  const qty = cartItem?.quantity ?? 0;

  const related = useMemo(() => {
    if (!allFoods || !food) return [];
    return allFoods.filter((f) => f.category === food.category && f._id !== food._id).slice(0, 4);
  }, [allFoods, food]);

  const handleAdd = () => {
    if (!access_Token) return navigate("/auth/login");
    if (!food) return;
    if (qty === 0) {
      addToCart(food._id, { onError: () => toast.error("Failed to add to cart") });
    } else {
      updateQty({ itemId: food._id, quantity: qty + 1 }, { onError: () => toast.error("Failed to update cart") });
    }
  };

  const handleDec = () => {
    if (!food) return;
    updateQty({ itemId: food._id, quantity: qty - 1 }, { onError: () => toast.error("Failed to update cart") });
  };

  if (isLoading) {
    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Skeleton className="h-6 w-24 mb-6" />
        <div className="grid md:grid-cols-2 gap-10">
          <Skeleton className="h-80 rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
      </main>
    );
  }

  if (!food) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-10 text-center py-36">
        <span className="text-6xl">🍽️</span>
        <h2 className="text-2xl font-bold mt-4">Item not found</h2>
        <Button className="mt-6" onClick={() => navigate("/")}>Back to Menu</Button>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Menu
      </button>

      {/* Detail card */}
      <div className="grid md:grid-cols-2 gap-10 rounded-3xl border border-border/50 bg-card shadow-sm overflow-hidden animate-fade-in">
        {/* Image */}
        <div className="relative h-72 md:h-full min-h-72 bg-muted overflow-hidden">
          <img
            src={getFoodImageUrl(food.image)}
            alt={food.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "";
              e.currentTarget.style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          <Badge className="absolute top-4 left-4 rounded-full bg-primary text-primary-foreground shadow-md">
            <Tag className="h-3 w-3 mr-1" />
            {food.category}
          </Badge>
        </div>

        {/* Info */}
        <div className="p-7 flex flex-col justify-center">
          <h1 className="text-3xl font-extrabold leading-tight mb-2">{food.name}</h1>

          {/* Meta chips */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-3 py-1">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> 4.8
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1">
              <Clock className="h-3 w-3" /> 25–35 min
            </span>
          </div>

          <p className="text-muted-foreground leading-relaxed mb-6">{food.description}</p>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-4xl font-extrabold text-primary">{food.price}</span>
            <span className="text-lg font-semibold text-muted-foreground">EGP</span>
          </div>

          {/* Cart controls */}
          {qty === 0 ? (
            <Button
              id={`detail-add-${food._id}`}
              className="w-full sm:w-auto rounded-xl h-12 text-base gap-2 shadow-md shadow-primary/25"
              size="lg"
              onClick={handleAdd}
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                id={`detail-dec-${food._id}`}
                variant="outline"
                size="icon"
                className="h-11 w-11 rounded-xl"
                onClick={handleDec}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-2xl font-bold tabular-nums w-8 text-center">{qty}</span>
              <Button
                id={`detail-inc-${food._id}`}
                variant="outline"
                size="icon"
                className="h-11 w-11 rounded-xl"
                onClick={handleAdd}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <span className="ml-2 text-sm text-muted-foreground">
                = <span className="font-bold text-primary">{food.price * qty} EGP</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Related items */}
      {related.length > 0 && (
        <section className="mt-14">
          <div className="flex items-center gap-2 mb-6">
            <span className="h-1 w-6 rounded-full bg-primary" />
            <h2 className="text-xl font-bold">You might also like</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((f) => (
              <FoodCard key={f._id} food={f} cartItem={cartMap[f._id]} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
