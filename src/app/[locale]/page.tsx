import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

import { ProductCard } from "@/components/shop/product-card";
import { HomeHero } from "@/components/sections/home-hero";
import { HomeHighlights } from "@/components/sections/home-highlights";
import { RealBrides } from "@/components/sections/real-brides";
import { Testimonials } from "@/components/sections/testimonials";
import { TrustBadges } from "@/components/sections/trust-badges";
import { MotionStaggerGrid } from "@/components/motion/stagger-grid";
import { SectionReveal } from "@/components/motion/section-reveal";
import { WishlistToastProvider } from "@/components/providers/wishlist-toast-provider";
import { Button } from "@/components/ui/button";
import { getCurrentUserProfile } from "@/lib/auth";
import { getFeaturedProducts, getWishlistProductIds } from "@/lib/shop";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("homeTitle"),
    description: t("homeDescription")
  };
}

export default async function HomePage() {
  const [t, profile, featuredProducts] = await Promise.all([
    getTranslations("FeaturedSection"),
    getCurrentUserProfile(),
    getFeaturedProducts(4)
  ]);
  const wishlistIds = profile
    ? await getWishlistProductIds(profile.id)
    : new Set<string>();

  return (
    <>
      <HomeHero />
      <SectionReveal>
        <HomeHighlights />
      </SectionReveal>
      <SectionReveal delay={0.04}>
        <TrustBadges />
      </SectionReveal>
      <SectionReveal delay={0.06}>
        <section className="section-shell pt-space-md md:pt-space-lg">
          <div className="mb-space-md flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-4">
              <p className="editorial-kicker">{t("kicker")}</p>
              <h2 className="max-w-2xl">
                {t("heading")}
              </h2>
            </div>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/collections">{t("viewCatalog")}</Link>
            </Button>
          </div>

          {featuredProducts.length === 0 ? (
            <div className="rounded-2xl border border-border/70 bg-card/85 p-10 text-center">
              <p className="font-display text-3xl">{t("comingSoon")}</p>
              <p className="mt-2 text-muted-foreground">
                {t("comingSoonNote")}
              </p>
            </div>
          ) : (
            <WishlistToastProvider>
              <MotionStaggerGrid className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {featuredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlistIds.has(product.id)}
                    showWishlist={Boolean(profile)}
                    imagePriority={index === 0}
                  />
                ))}
              </MotionStaggerGrid>
            </WishlistToastProvider>
          )}
        </section>
      </SectionReveal>
      <SectionReveal delay={0.08}>
        <RealBrides />
      </SectionReveal>
      <SectionReveal delay={0.1}>
        <Testimonials />
      </SectionReveal>
    </>
  );
}
