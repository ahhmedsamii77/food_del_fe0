import { useState } from "react";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className="group overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 animate-fade-in">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-muted">
        {!imgError ? (
          <img
            src={getFoodImageUrl(food.image)}
            alt={food.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
        <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-xs">
          {food.category}
        </Badge>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-base leading-tight line-clamp-1">{food.name}</h3>
          <span className="text-primary font-bold text-base shrink-0">
            {food.price} EGP
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {food.description}
        </p>

        {/* Cart controls */}
        {quantity === 0 ? (
          <Button
            className="w-full group/btn"
            onClick={handleAdd}
            disabled={isAdding}
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4 group-hover/btn:rotate-90 transition-transform duration-200" />
            {isAdding ? "Adding..." : "Add to Cart"}
          </Button>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full border-primary/30 hover:bg-primary/10 hover:border-primary"
              onClick={handleRemove}
              disabled={isRemoving}
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <span className="font-semibold text-base min-w-8 text-center">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full border-primary/30 hover:bg-primary/10 hover:border-primary"
              onClick={handleAdd}
              disabled={isAdding}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function FoodCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  );
}
