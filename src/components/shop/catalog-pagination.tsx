import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import type { CatalogSort } from "@/lib/shop";
import { cn } from "@/lib/utils";

type CatalogPaginationProps = {
  page: number;
  totalPages: number;
  query: string;
  sort: CatalogSort;
};

function getPageHref(page: number, query: string, sort: CatalogSort) {
  const searchParams = new URLSearchParams();

  if (query) {
    searchParams.set("q", query);
  }

  if (sort !== "featured") {
    searchParams.set("sort", sort);
  }

  if (page > 1) {
    searchParams.set("page", String(page));
  }

  const serialized = searchParams.toString();
  return serialized ? `/collections?${serialized}` : "/collections";
}

export function CatalogPagination({
  page,
  totalPages,
  query,
  sort
}: CatalogPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-8 flex items-center justify-between gap-3">
      <Link
        href={getPageHref(page - 1, query, sort)}
        aria-disabled={page <= 1}
        tabIndex={page <= 1 ? -1 : 0}
        className={cn(
          buttonVariants({ variant: "outline" }),
          page <= 1 && "pointer-events-none opacity-50"
        )}
      >
        Previous
      </Link>

      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Page {page} of {totalPages}
      </p>

      <Link
        href={getPageHref(page + 1, query, sort)}
        aria-disabled={page >= totalPages}
        tabIndex={page >= totalPages ? -1 : 0}
        className={cn(
          buttonVariants({ variant: "outline" }),
          page >= totalPages && "pointer-events-none opacity-50"
        )}
      >
        Next
      </Link>
    </div>
  );
}
