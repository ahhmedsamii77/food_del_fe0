const CATEGORIES = [
  { label: "All", value: "all", emoji: "🍽️" },
  { label: "Salad", value: "Salad", emoji: "🥗" },
  { label: "Rolls", value: "Rolls", emoji: "🌯" },
  { label: "Deserts", value: "Deserts", emoji: "🍰" },
  { label: "Sandwich", value: "Sandwich", emoji: "🥪" },
  { label: "Cake", value: "Cake", emoji: "🎂" },
  { label: "Pure Veg", value: "Pure Veg", emoji: "🥦" },
  { label: "Pasta", value: "Pasta", emoji: "🍝" },
  { label: "Noodles", value: "Noodles", emoji: "🍜" },
];

interface CategoryFilterProps {
  selected: string;
  onChange: (cat: string) => void;
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0 border
            ${
              selected === cat.value
                ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20 scale-105"
                : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground hover:bg-accent"
            }`}
        >
          <span>{cat.emoji}</span>
          {cat.label}
        </button>
      ))}
    </div>
  );
}
