import { useState } from "react";
import { Plus, Minus, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddToCart, useRemoveFromCart } from "@/lib/hooks";
import { useAuthStore } from "@/lib/store/auth";
import { getFoodImageUrl } from "@/lib/api/food.api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { FoodItem, CartItem } from "@/types";

interface FoodCardProps {
  food: FoodItem;
  cartItem?: CartItem;
}

export default function FoodCard({ food, cartItem }: FoodCardProps) {
  const navigate = useNavigate();
  const { access_Token } = useAuthStore();
  const { mutate: addToCart, isPending: isAdding } = useAddToCart();
  const { mutate: removeFromCart, isPending: isRemoving } = useRemoveFromCart();
  const [imgError, setImgError] = useState(false);

  const quantity = cartItem?.quantity ?? 0;

  const handleAdd = () => {
    if (!access_Token) {
      toast.error("Please sign in to add items to cart");
      navigate("/auth/login");
      return;
    }
    addToCart(food._id, {
      onError: () => toast.error("Failed to add to cart"),
    });
  };

  const handleRemove = () => {
    removeFromCart(food._id, {
      onError: () => toast.error("Failed to remove from cart"),
    });
  };

  return (
    <article className="group flex flex-col rounded-2xl overflow-hidden border border-border/50 bg-card shadow-sm card-lift animate-fade-in">
      {/* ── Image ── */}
      <div className="relative h-52 overflow-hidden bg-muted shrink-0">
        {!imgError ? (
          <img
            src={getFoodImageUrl(food.image)}
            alt={food.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <ShoppingCart className="h-14 w-14 text-muted-foreground/20" />
          </div>
        )}

        {/* Category badge */}
        <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground shadow-sm">
          {food.category}
        </span>

        {/* Quantity in-cart indicator */}
        {quantity > 0 && (
          <span className="absolute top-3 right-3 inline-flex items-center justify-center h-6 w-6 rounded-full bg-foreground text-background text-[11px] font-bold animate-badge-pop">
            {quantity}
          </span>
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Name + price */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-[15px] leading-snug line-clamp-1">
            {food.name}
          </h3>
          <span className="shrink-0 text-primary font-extrabold text-base">
            {food.price}&nbsp;EGP
          </span>
        </div>

        {/* Static star rating for visual richness */}
        <div className="flex items-center gap-0.5" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`h-3 w-3 ${
                s <= 4
                  ? "fill-amber-400 text-amber-400"
                  : "fill-muted text-muted-foreground/30"
              }`}
            />
          ))}
          <span className="ml-1.5 text-xs text-muted-foreground">4.0</span>
        </div>

        {/* Description */}
        <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed flex-1">
          {food.description}
        </p>

        {/* Cart controls */}
        {quantity === 0 ? (
          <Button
            id={`add-to-cart-${food._id}`}
            className="w-full mt-auto rounded-xl gap-2 shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/30 transition-shadow"
            onClick={handleAdd}
            disabled={isAdding}
            size="sm"
          >
            <Plus className="h-4 w-4" />
            {isAdding ? "Adding…" : "Add to Cart"}
          </Button>
        ) : (
          <div className="flex items-center justify-between mt-auto">
            <Button
              id={`remove-${food._id}`}
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-xl border-border hover:border-primary/40 hover:bg-primary/5"
              onClick={handleRemove}
              disabled={isRemoving}
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <span className="font-bold text-lg min-w-8 text-center tabular-nums">
              {quantity}
            </span>
            <Button
              id={`add-more-${food._id}`}
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-xl border-border hover:border-primary/40 hover:bg-primary/5"
              onClick={handleAdd}
              disabled={isAdding}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}

export function FoodCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-border/50 bg-card">
      <Skeleton className="h-52 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between gap-3">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-14" />
        </div>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-9 w-full mt-2" />
      </div>
    </div>
  );
}
