import Link from "next/link";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({ currentPage, totalPages, baseUrl }) {
  if (totalPages <= 1) return null;

  // Helper function to generate the page numbers with ellipses
  const getVisiblePages = (current, total) => {
    // If there are 7 or fewer pages, show all of them
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    // If current page is among the first 4 pages
    if (current <= 4) {
      return [1, 2, 3, 4, 5, "...", total];
    }

    // If current page is among the last 4 pages
    if (current >= total - 3) {
      return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    }

    // If current page is somewhere in the middle
    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
      {/* Previous Button */}
      <Link
        href={currentPage > 1 ? `${baseUrl}?page=${currentPage - 1}` : "#"}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-element transition-colors hover:bg-element-hover",
          currentPage <= 1 && "pointer-events-none opacity-50",
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>

      {/* Page Numbers & Ellipses */}
      {visiblePages.map((page, index) => {
        if (page === "...") {
          return (
            <div
              key={`ellipsis-${index}`}
              className="flex h-9 w-9 items-center justify-center text-text-muted"
            >
              <MoreHorizontal className="h-4 w-4" />
            </div>
          );
        }

        return (
          <Link
            key={page}
            href={`${baseUrl}?page=${page}`}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors",
              currentPage === page
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-element hover:bg-element-hover",
            )}
          >
            {page}
          </Link>
        );
      })}

      {/* Next Button */}
      <Link
        href={
          currentPage < totalPages ? `${baseUrl}?page=${currentPage + 1}` : "#"
        }
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-element transition-colors hover:bg-element-hover",
          currentPage >= totalPages && "pointer-events-none opacity-50",
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
