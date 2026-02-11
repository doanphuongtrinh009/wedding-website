import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

import { MotionStaggerGrid } from "@/components/motion/stagger-grid";
import { WishlistToastProvider } from "@/components/providers/wishlist-toast-provider";
import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import { requireUserProfile } from "@/lib/auth";
import { getWishlistProducts } from "@/lib/shop";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "Wishlist" });

  return {
    title: t("heading"),
    description: t("description"),
    robots: {
      index: false,
      follow: false
    }
  };
}

export default async function WishlistPage() {
  const [t, profile] = await Promise.all([
    getTranslations("Wishlist"),
    requireUserProfile()
  ]);
  const wishlistItems = await getWishlistProducts(profile.id);

  return (
    <section className="section-shell">
      <div className="mb-space-lg space-y-4">
        <p className="editorial-kicker">{t("kicker")}</p>
        <h1>{t("heading")}</h1>
        <p className="max-w-2xl text-muted-foreground">{t("description")}</p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="rounded-2xl border border-border/70 bg-card/85 p-10 text-center">
          <p className="font-display text-3xl">{t("empty")}</p>
          <p className="mt-2 text-muted-foreground">{t("emptyNote")}</p>
          <Button asChild className="mt-5">
            <Link href="/collections">{t("explore")}</Link>
          </Button>
        </div>
      ) : (
        <WishlistToastProvider>
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
        </WishlistToastProvider>
      )}
    </section>
  );
}
