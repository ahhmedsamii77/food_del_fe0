import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductsPaginationProps {
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
}

export default function ProductsPagination({
  currentPage,
  totalPages,
  setPage,
}: ProductsPaginationProps) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show page 1
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <nav className="flex items-center justify-center gap-2 mt-10 animate-fade-in" aria-label="Pagination">
      {/* Previous button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="h-10 w-10 rounded-xl border-border hover:border-primary/40 hover:bg-primary/5 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      {/* Page numbers */}
      <div className="flex items-center gap-1.5">
        {getPages().map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className="w-10 text-center text-muted-foreground font-medium select-none">
                …
              </span>
            );
          }

          const isCurrent = page === currentPage;

          return (
            <Button
              key={`page-${page}`}
              onClick={() => setPage(page as number)}
              variant={isCurrent ? "default" : "outline"}
              className={`h-10 w-10 p-0 rounded-xl font-bold cursor-pointer text-sm transition-all duration-300 ${
                isCurrent
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                  : "border-border hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-foreground"
              }`}
            >
              {page}
            </Button>
          );
        })}
      </div>

      {/* Next button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="h-10 w-10 rounded-xl border-border hover:border-primary/40 hover:bg-primary/5 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </nav>
  );
}
