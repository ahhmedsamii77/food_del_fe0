const CATEGORIES = [
  { label: "All",      value: "all",       emoji: "🍽️" },
  { label: "Salad",    value: "Salad",     emoji: "🥗" },
  { label: "Rolls",    value: "Rolls",     emoji: "🌯" },
  { label: "Deserts",  value: "Deserts",   emoji: "🍰" },
  { label: "Sandwich", value: "Sandwich",  emoji: "🥪" },
  { label: "Cake",     value: "Cake",      emoji: "🎂" },
  { label: "Pure Veg", value: "Pure Veg",  emoji: "🥦" },
  { label: "Pasta",    value: "Pasta",     emoji: "🍝" },
  { label: "Noodles",  value: "Noodles",   emoji: "🍜" },
];

interface CategoryFilterProps {
  selected: string;
  onChange: (cat: string) => void;
}

export default function CategoryFilter({
  selected,
  onChange,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {CATEGORIES.map((cat) => {
        const isActive = selected === cat.value;
        return (
          <button
            key={cat.value}
            id={`category-${cat.value}`}
            onClick={() => onChange(cat.value)}
            className={[
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap shrink-0 transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/30 scale-[1.03]"
                : "bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground",
            ].join(" ")}
          >
            <span className="text-base leading-none">{cat.emoji}</span>
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
