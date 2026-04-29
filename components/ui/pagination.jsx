import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export function Pagination({ currentPage, totalPages, baseUrl }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Link
        href={currentPage > 1 ? `${baseUrl}?page=${currentPage - 1}` : "#"}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-element transition-colors hover:bg-element-hover",
          currentPage <= 1 && "pointer-events-none opacity-50",
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>

      {pages.map((page) => (
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
      ))}

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
