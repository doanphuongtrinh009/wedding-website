import Image from "next/image";
import Link from "next/link";

import { WishlistToggleButton } from "@/components/shop/wishlist-toggle-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { formatCurrency, truncate } from "@/lib/format";
import { getOptimizedCloudinaryUrl } from "@/lib/image";
import type { ProductCard as ProductCardData } from "@/lib/shop";

type ProductCardProps = {
  product: ProductCardData;
  isWishlisted: boolean;
  showWishlist?: boolean;
  imagePriority?: boolean;
};

export function ProductCard({
  product,
  isWishlisted,
  showWishlist = true,
  imagePriority = false
}: ProductCardProps) {
  const primaryImage = product.images[0];
  const optimizedPrimaryImage = primaryImage
    ? getOptimizedCloudinaryUrl(primaryImage.secureUrl, {
        width: 900,
        quality: 80,
        crop: "fill"
      })
    : null;

  return (
    <Card
      variant="product"
      className="group overflow-hidden bg-card/95 [content-visibility:auto]"
    >
      <div className="relative aspect-[4/5] border-b border-border/70 bg-secondary/35">
        {primaryImage ? (
          <Image
            src={optimizedPrimaryImage ?? primaryImage.secureUrl}
            alt={primaryImage.altText || product.name}
            fill
            className="object-cover transition duration-700 motion-safe:group-hover:scale-[1.035]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            priority={imagePriority}
            fetchPriority={imagePriority ? "high" : "auto"}
          />
        ) : (
          <div className="h-full w-full bg-[linear-gradient(145deg,rgba(255,250,245,1)_0%,rgba(235,216,201,0.95)_100%)]" />
        )}

        <div
          className="absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(180deg,rgba(25,18,16,0)_0%,rgba(25,18,16,0.2)_100%)]"
          aria-hidden="true"
        />

        {product.isFeatured ? (
          <Badge
            variant="secondary"
            className="bg-background/88 absolute left-3 top-3 backdrop-blur"
          >
            Featured
          </Badge>
        ) : null}

        {showWishlist ? (
          <div className="absolute right-3 top-3">
            <WishlistToggleButton
              productId={product.id}
              initialWishlisted={isWishlisted}
            />
          </div>
        ) : null}
      </div>

      <CardHeader className="space-y-2 pb-2">
        <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-brand-taupe">
          Private try-on eligible
        </p>
        <CardTitle className="text-[1.8rem] leading-tight md:text-[1.95rem]">
          <Link
            href={`/collections/${product.slug}`}
            className="transition-colors hover:text-primary"
          >
            {product.name}
          </Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {truncate(product.description, 108)}
        </p>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="font-display text-[2rem] leading-none text-brand-cocoa">
          {formatCurrency(product.priceInCents, product.currency)}
        </p>
      </CardContent>

      <CardFooter className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Button asChild variant="outline" className="w-full">
          <Link href={`/collections/${product.slug}`}>View gown</Link>
        </Button>
        <Button asChild className="w-full">
          <Link href={`/book?productId=${product.id}`}>Book try-on</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
