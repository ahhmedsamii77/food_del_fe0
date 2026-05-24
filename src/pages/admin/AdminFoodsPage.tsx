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

export default function AdminFoodsPage() {
  const { data: foods, isLoading } = useGetFoods();
  const removeFoodMutation = useRemoveFood();
  const addFoodMutation = useAddFood();

  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

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
        <Button
          id="add-food-btn"
          className="gap-2 self-start md:self-auto rounded-xl shadow-md shadow-primary/20"
          onClick={() => {
            resetForm();
            setIsAddOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Add Food Item
        </Button>
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
