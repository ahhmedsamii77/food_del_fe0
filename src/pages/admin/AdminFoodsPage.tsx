import React, { useState, useEffect } from "react";
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
  ChevronLeft,
  ChevronRight,
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

const ITEMS_PER_PAGE = 8;

export default function AdminFoodsPage() {
  const { data: foods, isLoading } = useGetFoods();
  const removeFoodMutation = useRemoveFood();
  const addFoodMutation = useAddFood();

  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Reset to page 1 on search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

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
      setDeletingId(id);
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
        onSettled: () => setDeletingId(null),
      });
    }
  };

  const filteredFoods = foods?.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const totalPages = Math.max(1, Math.ceil(filteredFoods.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedFoods = filteredFoods.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  // Build visible page numbers (max 5 around current)
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    pages.push(1);
    if (safePage > 3) pages.push("...");
    for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) {
      pages.push(i);
    }
    if (safePage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Food Menu</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your restaurant items, categories, and pricing.
          </p>
        </div>
        <Button
          id="add-food-btn"
          className="gap-2 w-full sm:w-auto rounded-xl shadow-md shadow-primary/20"
          onClick={() => {
            resetForm();
            setIsAddOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Add Food Item
        </Button>
      </div>

      {/* ── Search & Stats Row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-3 bg-card border rounded-2xl p-3 shadow-sm flex-1 max-w-md">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            id="search-foods-input"
            type="text"
            placeholder="Search by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-0 text-sm focus:outline-none placeholder:text-muted-foreground"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-muted-foreground hover:text-foreground text-xs px-1.5 py-0.5 rounded-md hover:bg-muted transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        {!isLoading && (
          <p className="text-sm text-muted-foreground shrink-0">
            {filteredFoods.length} item{filteredFoods.length !== 1 ? "s" : ""}
            {search && " found"}
          </p>
        )}
      </div>

      {/* ── Foods Grid ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
            <div key={i} className="border rounded-2xl p-4 bg-card space-y-4">
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
      ) : paginatedFoods.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {paginatedFoods.map((food) => (
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
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400";
                  }}
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-black/60 text-white border-0 hover:bg-black/60 rounded-lg backdrop-blur-xs text-xs">
                    {food.category}
                  </Badge>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm sm:text-base line-clamp-1">
                    {food.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {food.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <span className="font-bold text-primary text-sm sm:text-base">
                    {food.price} EGP
                  </span>
                  <Button
                    id={`remove-food-${food._id}`}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveFood(food._id)}
                    disabled={deletingId === food._id}
                  >
                    {deletingId === food._id ? (
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
        <div className="border border-dashed rounded-3xl p-10 sm:p-14 text-center max-w-md mx-auto space-y-4">
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

      {/* ── Pagination ── */}
      {!isLoading && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-border/60">
          {/* Info */}
          <p className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1">
            Showing{" "}
            <span className="font-medium text-foreground">
              {(safePage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(safePage * ITEMS_PER_PAGE, filteredFoods.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">{filteredFoods.length}</span>{" "}
            items
          </p>

          {/* Controls */}
          <div className="flex items-center gap-1.5 order-1 sm:order-2">
            {/* Prev */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-xl"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page numbers */}
            {getPageNumbers().map((page, i) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  className="h-8 w-8 flex items-center justify-center text-sm text-muted-foreground"
                >
                  …
                </span>
              ) : (
                <Button
                  key={page}
                  variant={safePage === page ? "default" : "outline"}
                  className={`h-8 w-8 rounded-xl text-xs font-semibold p-0 ${
                    safePage === page ? "shadow-md shadow-primary/20" : ""
                  }`}
                  onClick={() => setCurrentPage(page as number)}
                  aria-label={`Page ${page}`}
                  aria-current={safePage === page ? "page" : undefined}
                >
                  {page}
                </Button>
              )
            )}

            {/* Next */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-xl"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Add Food Dialog ── */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-[480px] p-5 sm:p-6 rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-bold">Add New Food Item</DialogTitle>
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
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="relative h-24 w-full sm:w-32 border-2 border-dashed border-muted-foreground/20 rounded-xl overflow-hidden bg-muted flex items-center justify-center shrink-0">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-muted-foreground/60">
                      <ImagePlus className="h-6 w-6" />
                      <span className="text-[10px]">Click to upload</span>
                    </div>
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
              <Label
                htmlFor="food-name"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
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
              <Label
                htmlFor="food-desc"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Description
              </Label>
              <textarea
                id="food-desc"
                placeholder="Describe the dish ingredients, preparation, details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
            </div>

            {/* Price & Category */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="food-price"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
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
                <Label
                  htmlFor="food-category"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Category
                </Label>
                <select
                  id="food-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-9 rounded-xl border border-input bg-background px-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-border -mx-5 sm:-mx-6 -mb-5 sm:-mb-6 px-5 sm:px-6 bg-muted/30 flex flex-row gap-2 justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsAddOpen(false)}
                className="rounded-xl flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              <Button
                id="save-food-btn"
                type="submit"
                className="rounded-xl gap-2 shadow-md shadow-primary/20 flex-1 sm:flex-none"
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
