import type { Metadata } from "next";
import Link from "next/link";

import { ProductCard } from "@/components/shop/product-card";
import { HomeHero } from "@/components/sections/home-hero";
import { HomeHighlights } from "@/components/sections/home-highlights";
import { Testimonials } from "@/components/sections/testimonials";
import { TrustBadges } from "@/components/sections/trust-badges";
import { MotionStaggerGrid } from "@/components/motion/stagger-grid";
import { Button } from "@/components/ui/button";
import { getCurrentUserProfile } from "@/lib/auth";
import { getFeaturedProducts, getWishlistProductIds } from "@/lib/shop";

export const metadata: Metadata = {
  title: "Luxury Bridal Shop",
  description:
    "Shop bridal collections, save wishlist favorites, and book private try-on appointments."
};

export default async function HomePage() {
  const profile = await getCurrentUserProfile();
  const featuredProducts = await getFeaturedProducts(4);
  const wishlistIds = profile
    ? await getWishlistProductIds(profile.id)
    : new Set<string>();

  return (
    <>
      <HomeHero />
      <HomeHighlights />
      <TrustBadges />
      <section className="section-shell pt-space-md md:pt-space-lg">
        <div className="mb-space-md flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-4">
            <p className="editorial-kicker">Featured Collection</p>
            <h2 className="max-w-2xl">
              Best-loved gowns for private try-on this season.
            </h2>
          </div>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/collections">View full catalog</Link>
          </Button>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="rounded-2xl border border-border/70 bg-card/85 p-10 text-center">
            <p className="font-display text-3xl">Featured styles coming soon</p>
            <p className="mt-2 text-muted-foreground">
              Product merchandising can be updated from the admin panel.
            </p>
          </div>
        ) : (
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
        )}
      </section>
      <Testimonials />
    </>
  );
}
