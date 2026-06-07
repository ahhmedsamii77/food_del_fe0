import React, { useState } from "react";
import { useGetFoods, useAddFood, useRemoveFood } from "@/lib/hooks";
import { getFoodImageUrl } from "@/lib/api/food.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Trash2,
  Search,
  Loader2,
  ImagePlus,
  UtensilsCrossed,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = [
  "Salad",
  "Rolls",
  "Deserts",
  "Sandwich",
  "Cake",
  "Pure Veg",
  "Pasta",
  "Noodles",
];

const SAMPLE_DISHES = [
  {
    name: "Greek Salad",
    description: "Crispy lettuce, cucumbers, cherry tomatoes, olives, and feta cheese, tossed in olive oil.",
    price: 95,
    category: "Salad",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60"
  },
  {
    name: "Quinoa Avocado Salad",
    description: "Nutritious quinoa mixed with ripe avocado, cherry tomatoes, spinach, and a zesty lemon dressing.",
    price: 120,
    category: "Salad",
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=60"
  },
  {
    name: "Chicken Caesar Salad",
    description: "Grilled chicken breast, crisp romaine lettuce, crunchy croutons, parmesan, and creamy Caesar dressing.",
    price: 140,
    category: "Salad",
    imageUrl: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&auto=format&fit=crop&q=60"
  },
  {
    name: "Spring Rolls",
    description: "Crispy golden rolls filled with fresh julienned vegetables and served with sweet chili sauce.",
    price: 80,
    category: "Rolls",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60"
  },
  {
    name: "Spicy Tuna Roll",
    description: "Fresh tuna mixed with spicy mayo, rolled with cucumber and seasoned sushi rice.",
    price: 160,
    category: "Rolls",
    imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=60"
  },
  {
    name: "Dynamite Shrimp Roll",
    description: "Sushi roll stuffed with tempura shrimp, avocado, topped with spicy dynamite sauce.",
    price: 180,
    category: "Rolls",
    imageUrl: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=500&auto=format&fit=crop&q=60"
  },
  {
    name: "Chocolate Lava Cake",
    description: "Rich chocolate cake with a warm, molten chocolate center, served with vanilla ice cream.",
    price: 110,
    category: "Deserts",
    imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60"
  },
  {
    name: "Strawberry Cheesecake",
    description: "Creamy New York style cheesecake topped with a sweet strawberry compote.",
    price: 95,
    category: "Deserts",
    imageUrl: "https://images.unsplash.com/photo-1524351199679-46cddf530c04?w=500&auto=format&fit=crop&q=60"
  },
  {
    name: "Tiramisu",
    description: "Classic Italian dessert made of coffee-dipped ladyfingers layered with whipped mascarpone.",
    price: 115,
    category: "Deserts",
    imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=60"
  },
  {
    name: "Club Sandwich",
    description: "Double-decker sandwich with turkey, grilled chicken, bacon, lettuce, tomato, and mayonnaise.",
    price: 130,
    category: "Sandwich",
    imageUrl: "https://images.unsplash.com/photo-1567234669003-dce7a7a88821?w=500&auto=format&fit=crop&q=60"
  },
  {
    name: "Philly Cheesesteak",
    description: "Thinly sliced beef steak, melted provolone cheese, caramelized onions, and bell peppers in a hoagie roll.",
    price: 175,
    category: "Sandwich",
    imageUrl: "https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?w=500&auto=format&fit=crop&q=60"
  },
  {
    name: "Caprese Panini",
    description: "Fresh mozzarella, ripe tomatoes, sweet basil leaves, and balsamic glaze pressed between artisanal bread.",
    price: 105,
    category: "Sandwich",
    imageUrl: "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=500&auto=format&fit=crop&q=60"
  },
  {
    name: "Red Velvet Cake",
    description: "Striking red cake layers filled and frosted with rich cream cheese icing.",
    price: 90,
    category: "Cake",
    imageUrl: "https://images.unsplash.com/photo-1616260841936-681846747682?w=500&auto=format&fit=crop&q=60"
  },
  {
    name: "Black Forest Cake",
    description: "Decadent chocolate sponge cake layers filled with cherries and fresh whipped cream.",
    price: 95,
    category: "Cake",
    imageUrl: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=500&auto=format&fit=crop&q=60"
  },
  {
    name: "Paneer Butter Masala",
    description: "Indian cottage cheese cubes cooked in a rich, creamy, and mildly sweet tomato-based gravy.",
    price: 150,
    category: "Pure Veg",
    imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=60"
  },
  {
    name: "Vegetable Biryani",
    description: "Fragrant basmati rice cooked with mixed vegetables, aromatic spices, and herbs.",
    price: 130,
    category: "Pure Veg",
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60"
  },
  {
    name: "Penne Arrabbiata",
    description: "Penne pasta tossed in a spicy tomato sauce with garlic, chili flakes, and fresh parsley.",
    price: 120,
    category: "Pasta",
    imageUrl: "https://images.unsplash.com/photo-1563379971899-660589a01cc3?w=500&auto=format&fit=crop&q=60"
  },
  {
    name: "Creamy Fettuccine Alfredo",
    description: "Rich and velvety Alfredo sauce tossed with fettuccine pasta and shaved parmesan.",
    price: 145,
    category: "Pasta",
    imageUrl: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&auto=format&fit=crop&q=60"
  },
  {
    name: "Chicken Hakka Noodles",
    description: "Stir-fried noodles with chicken strips, mixed vegetables, soy sauce, and aromatic spices.",
    price: 125,
    category: "Noodles",
    imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=60"
  },
  {
    name: "Spicy Ramen",
    description: "Rich bone broth with noodles, soft-boiled egg, chicken chashu, green onions, and chili oil.",
    price: 190,
    category: "Noodles",
    imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=60"
  }
];

function generatePlaceholderImage(name: string, category: string): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      resolve(new File([], "placeholder.png"));
      return;
    }

    const colors: Record<string, string> = {
      Salad: "#10B981",
      Rolls: "#F59E0B",
      Deserts: "#EC4899",
      Sandwich: "#8B5CF6",
      Cake: "#EF4444",
      "Pure Veg": "#22C55E",
      Pasta: "#3B82F6",
      Noodles: "#6366F1",
    };
    const color = colors[category] || "#6B7280";

    const gradient = ctx.createLinearGradient(0, 0, 400, 300);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, "#111827");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 300);

    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    ctx.beginPath();
    ctx.arc(200, 150, 100, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = "bold 24px system-ui, sans-serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(name, 200, 130);

    ctx.font = "600 16px system-ui, sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillText(category, 200, 170);

    ctx.font = "500 12px system-ui, sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillText("Delicious Food Item", 200, 200);

    canvas.toBlob((blob) => {
      if (blob) {
        resolve(new File([blob], `${name.toLowerCase().replace(/[^a-z0-9]/g, "_")}.png`, { type: "image/png" }));
      } else {
        resolve(new File([], "placeholder.png"));
      }
    }, "image/png");
  });
}

async function getImageFile(name: string, category: string, url: string): Promise<File> {
  try {
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) throw new Error("Failed to fetch image");
    const blob = await response.blob();
    const filename = `${name.toLowerCase().replace(/[^a-z0-9]/g, "_")}.jpg`;
    return new File([blob], filename, { type: blob.type || "image/jpeg" });
  } catch (err) {
    console.warn(`Failed to fetch image for ${name}, using canvas placeholder:`, err);
    return generatePlaceholderImage(name, category);
  }
}

export default function AdminFoodsPage() {
  const { data: foods, isLoading } = useGetFoods();
  const removeFoodMutation = useRemoveFood();
  const addFoodMutation = useAddFood();

  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedingProgress, setSeedingProgress] = useState(0);

  const handleSeedDishes = async () => {
    if (!confirm("Are you sure you want to add 20 sample dishes to the menu?")) {
      return;
    }
    setIsSeeding(true);
    setSeedingProgress(0);
    try {
      for (let i = 0; i < SAMPLE_DISHES.length; i++) {
        setSeedingProgress(i + 1);
        const dish = SAMPLE_DISHES[i];
        const imageFile = await getImageFile(dish.name, dish.category, dish.imageUrl);
        
        const formData = new FormData();
        formData.append("name", dish.name);
        formData.append("description", dish.description);
        formData.append("price", dish.price.toString());
        formData.append("category", dish.category);
        formData.append("image", imageFile);

        const res = await addFoodMutation.mutateAsync(formData);
        if (!res.data.success) {
          throw new Error(res.data.message || `Failed to add ${dish.name}`);
        }
      }
      toast.success("Successfully seeded 20 delicious dishes!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An error occurred during seeding. Please try again.");
    } finally {
      setIsSeeding(false);
      setSeedingProgress(0);
    }
  };

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setCategory(CATEGORIES[0]);
    setImageFile(null);
    setImagePreview("");
  };

  const handleAddFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !price || !category || !imageFile) {
      toast.error("Please fill in all fields including the image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("image", imageFile);

    addFoodMutation.mutate(formData, {
      onSuccess: (res: any) => {
        if (res.data.success) {
          toast.success("Food item added successfully!");
          setIsAddOpen(false);
          resetForm();
        } else {
          toast.error(res.data.message || "Failed to add food item");
        }
      },
      onError: (err: any) => {
        console.error(err);
        toast.error("Error adding food item");
      },
    });
  };

  const handleRemoveFood = (id: string) => {
    if (confirm("Are you sure you want to remove this food item?")) {
      removeFoodMutation.mutate(id, {
        onSuccess: (res: any) => {
          if (res.data.success) {
            toast.success("Food item removed successfully!");
          } else {
            toast.error(res.data.message || "Failed to remove food item");
          }
        },
        onError: (err: any) => {
          console.error(err);
          toast.error("Error removing food item");
        },
      });
    }
  };

  const filteredFoods = foods?.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Food Menu</h1>
          <p className="text-sm text-muted-foreground">
            Manage your restaurant items, categories, and pricing.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 self-start md:self-auto">
          <Button
            id="seed-foods-btn"
            variant="outline"
            className="gap-2 rounded-xl border-primary/30 hover:border-primary hover:bg-primary/5 text-primary"
            onClick={handleSeedDishes}
            disabled={isSeeding}
          >
            {isSeeding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {isSeeding ? `Seeding (${seedingProgress}/20)...` : "Seed 20 Dishes"}
          </Button>
          <Button
            id="add-food-btn"
            className="gap-2 rounded-xl shadow-md shadow-primary/20"
            onClick={() => {
              resetForm();
              setIsAddOpen(true);
            }}
            disabled={isSeeding}
          >
            <Plus className="h-4 w-4" />
            Add Food Item
          </Button>
        </div>
      </div>

      {/* ── Search & Filter ── */}
      <div className="flex items-center gap-3 bg-card border rounded-2xl p-3 shadow-sm max-w-md">
        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
        <input
          id="search-foods-input"
          type="text"
          placeholder="Search by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent border-0 text-sm focus:outline-none placeholder:text-muted-foreground"
        />
      </div>

      {/* ── Foods Grid/Table ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="border rounded-2xl p-4 bg-card space-y-4"
            >
              <Skeleton className="aspect-video w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredFoods && filteredFoods.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFoods.map((food) => (
            <div
              key={food._id}
              className="group border rounded-2xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="relative aspect-video bg-muted overflow-hidden">
                <img
                  src={getFoodImageUrl(food.image)}
                  alt={food.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // fallback image
                    e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400";
                  }}
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-black/60 text-white border-0 hover:bg-black/60 rounded-lg backdrop-blur-xs">
                    {food.category}
                  </Badge>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <h3 className="font-semibold text-base line-clamp-1">
                    {food.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {food.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <span className="font-bold text-primary text-base">
                    {food.price} EGP
                  </span>
                  <Button
                    id={`remove-food-${food._id}`}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveFood(food._id)}
                    disabled={removeFoodMutation.isPending}
                  >
                    {removeFoodMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
            <UtensilsCrossed className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">No foods found</h3>
            <p className="text-sm text-muted-foreground">
              {search
                ? "No items match your search term."
                : "Get started by adding your first food item."}
            </p>
          </div>
          {search && (
            <Button
              variant="outline"
              onClick={() => setSearch("")}
              className="rounded-xl"
            >
              Clear Search
            </Button>
          )}
        </div>
      )}

      {/* ── Add Food Dialog ── */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[480px] p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Add New Food Item</DialogTitle>
            <DialogDescription>
              Create a new item to list on the food delivery menu.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddFood} className="space-y-4 py-2">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Food Image
              </Label>
              <div className="flex gap-4 items-center">
                <div className="relative h-24 w-32 border-2 border-dashed border-muted-foreground/20 rounded-xl overflow-hidden bg-muted flex items-center justify-center shrink-0 group">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImagePlus className="h-6 w-6 text-muted-foreground/60" />
                  )}
                  <input
                    id="food-image-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs font-medium">Upload a photo</p>
                  <p className="text-[10px] text-muted-foreground">
                    JPG, PNG or WEBP. Max size 2MB.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="relative rounded-lg text-xs"
                  >
                    Select File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </Button>
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="food-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Item Name
              </Label>
              <Input
                id="food-name"
                placeholder="e.g. Garlic Butter Shrimp Pasta"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded-xl"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="food-desc" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Description
              </Label>
              <textarea
                id="food-desc"
                placeholder="Describe the dish ingredients, preparation, details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Price & Category */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="food-price" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Price (EGP)
                </Label>
                <Input
                  id="food-price"
                  type="number"
                  placeholder="250"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min="0"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="food-category" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Category
                </Label>
                <select
                  id="food-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-9 rounded-xl border border-input bg-background px-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-border -mx-6 -mb-6 px-6 bg-muted/30">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsAddOpen(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                id="save-food-btn"
                type="submit"
                className="rounded-xl gap-2 shadow-md shadow-primary/20"
                disabled={addFoodMutation.isPending}
              >
                {addFoodMutation.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Save Dish
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
