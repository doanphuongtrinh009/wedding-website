import type { Metadata } from "next";

import { CatalogPagination } from "@/components/shop/catalog-pagination";
import { CatalogToolbar } from "@/components/shop/catalog-toolbar";
import { MotionStaggerGrid } from "@/components/motion/stagger-grid";
import { ProductCard } from "@/components/shop/product-card";
import { getCurrentUserProfile } from "@/lib/auth";
import {
  getCatalogProducts,
  getWishlistProductIds,
  type CatalogSort,
  catalogSortOptions
} from "@/lib/shop";

export const metadata: Metadata = {
  title: "Bridal Collections",
  description:
    "Browse luxury bridal gowns and reserve private try-on appointments.",
  alternates: {
    canonical: "/collections"
  }
};

const allowedSortValues = new Set(
  catalogSortOptions.map((option) => option.value)
);

function getSingleSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getSortValue(value: string | undefined): CatalogSort {
  if (!value) {
    return "featured";
  }

  return allowedSortValues.has(value as CatalogSort)
    ? (value as CatalogSort)
    : "featured";
}

function getPageValue(value: string | undefined) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || numericValue < 1) {
    return 1;
  }

  return Math.floor(numericValue);
}

export default async function CollectionsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = getSingleSearchParam(params.q)?.trim() ?? "";
  const sort = getSortValue(getSingleSearchParam(params.sort));
  const page = getPageValue(getSingleSearchParam(params.page));

  const profile = await getCurrentUserProfile();
  const catalog = await getCatalogProducts({
    query,
    sort,
    page,
    pageSize: 12
  });

  const wishlistIds = profile
    ? await getWishlistProductIds(profile.id)
    : new Set<string>();

  return (
    <section className="section-shell">
      <div className="mb-space-lg space-y-4">
        <p className="editorial-kicker">Product Catalog</p>
        <h1>Bridal collections</h1>
        <p className="max-w-2xl text-muted-foreground">
          Explore curated silhouettes, compare pricing, and schedule in-store
          try-on appointments directly from each product page.
        </p>
      </div>

      <CatalogToolbar defaultQuery={query} defaultSort={sort} />

      <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-background/70 px-4 py-3 text-sm text-muted-foreground">
        <p>{catalog.total} gowns available</p>
      </div>

      {catalog.items.length === 0 ? (
        <div className="bg-card/82 mt-6 rounded-[1.3rem] border border-border/70 p-10 text-center shadow-editorial">
          <p className="font-display text-3xl">No products found</p>
          <p className="mt-2 text-muted-foreground">
            Try a different keyword or remove filters.
          </p>
        </div>
      ) : (
        <MotionStaggerGrid className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {catalog.items.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlistIds.has(product.id)}
              showWishlist={Boolean(profile)}
              imagePriority={index < 2}
            />
          ))}
        </MotionStaggerGrid>
      )}

      <CatalogPagination
        page={catalog.page}
        totalPages={catalog.totalPages}
        query={query}
        sort={sort}
      />
    </section>
  );
}
