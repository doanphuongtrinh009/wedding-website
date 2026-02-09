import type { Metadata } from "next";
import Link from "next/link";

import { MotionStaggerGrid } from "@/components/motion/stagger-grid";
import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import { requireUserProfile } from "@/lib/auth";
import { getWishlistProducts } from "@/lib/shop";

export const metadata: Metadata = {
  title: "Wishlist",
  robots: {
    index: false,
    follow: false
  }
};

export default async function WishlistPage() {
  const profile = await requireUserProfile();
  const wishlistItems = await getWishlistProducts(profile.id);

  return (
    <section className="section-shell">
      <div className="mb-space-lg space-y-4">
        <p className="editorial-kicker">Saved Favorites</p>
        <h1>Your wishlist</h1>
        <p className="max-w-2xl text-muted-foreground">
          Keep your favorite gowns in one place and book try-on appointments
          when you are ready.
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="rounded-2xl border border-border/70 bg-card/85 p-10 text-center">
          <p className="font-display text-3xl">No saved products yet</p>
          <p className="mt-2 text-muted-foreground">
            Start exploring the catalog and add products to shortlist.
          </p>
          <Button asChild className="mt-5">
            <Link href="/collections">Explore collections</Link>
          </Button>
        </div>
      ) : (
        <MotionStaggerGrid className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {wishlistItems.map((wishlistItem, index) => (
            <ProductCard
              key={wishlistItem.product.id}
              product={wishlistItem.product}
              isWishlisted={true}
              showWishlist={true}
              imagePriority={index === 0}
            />
          ))}
        </MotionStaggerGrid>
      )}
    </section>
  );
}
