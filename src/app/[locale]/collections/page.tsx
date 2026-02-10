import { getTranslations } from "next-intl/server";

import { CatalogPagination } from "@/components/shop/catalog-pagination";
import { CatalogToolbar } from "@/components/shop/catalog-toolbar";
import { SectionReveal } from "@/components/motion/section-reveal";
import { MotionStaggerGrid } from "@/components/motion/stagger-grid";
import { WishlistToastProvider } from "@/components/providers/wishlist-toast-provider";
import { ProductCard } from "@/components/shop/product-card";
import { getCurrentUserProfile } from "@/lib/auth";
import {
  getCatalogProducts,
  getWishlistProductIds,
  type CatalogSort,
  catalogSortOptions
} from "@/lib/shop";

export async function generateMetadata() {
  const t = await getTranslations("CollectionsPage");

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: "/collections"
    }
  };
}

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
  const [t, params] = await Promise.all([
    getTranslations("CollectionsPage"),
    searchParams
  ]);
  const query = getSingleSearchParam(params.q)?.trim() ?? "";
  const sort = getSortValue(getSingleSearchParam(params.sort));
  const page = getPageValue(getSingleSearchParam(params.page));

  const [profile, catalog] = await Promise.all([
    getCurrentUserProfile(),
    getCatalogProducts({
      query,
      sort,
      page,
      pageSize: 12
    })
  ]);

  const wishlistIds = profile
    ? await getWishlistProductIds(profile.id)
    : new Set<string>();

  return (
    <section className="section-shell">
      <SectionReveal>
        <div className="mb-space-lg space-y-4">
          <p className="editorial-kicker">{t("kicker")}</p>
          <h1>{t("title")}</h1>
          <p className="max-w-2xl text-muted-foreground">{t("description")}</p>
        </div>

        <CatalogToolbar defaultQuery={query} defaultSort={sort} />

        <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-background/70 px-4 py-3 text-sm text-muted-foreground">
          <p>{t("count", { count: catalog.total })}</p>
        </div>
      </SectionReveal>

      <SectionReveal delay={0.05}>
        {catalog.items.length === 0 ? (
          <div className="bg-card/82 mt-6 rounded-[1.3rem] border border-border/70 p-10 text-center shadow-editorial">
            <p className="font-display text-3xl">{t("noResultsTitle")}</p>
            <p className="mt-2 text-muted-foreground">{t("noResultsDesc")}</p>
          </div>
        ) : (
          <WishlistToastProvider>
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
          </WishlistToastProvider>
        )}
      </SectionReveal>

      <SectionReveal delay={0.08}>
        <CatalogPagination
          page={catalog.page}
          totalPages={catalog.totalPages}
          query={query}
          sort={sort}
        />
      </SectionReveal>
    </section>
  );
}
