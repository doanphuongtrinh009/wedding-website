import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowUpRight, CalendarDays } from "lucide-react";

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
  const t = useTranslations("ProductCard");
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
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-card/95 [content-visibility:auto]"
    >
      <div className="relative aspect-[4/5] border-b border-border/70 bg-secondary/35">
        {primaryImage ? (
          <Image
            src={optimizedPrimaryImage ?? primaryImage.secureUrl}
            alt={primaryImage.altText || product.name}
            fill
            className="rounded-t-2xl object-cover transition-transform duration-300 ease-out motion-safe:will-change-transform motion-safe:group-hover:scale-[1.045]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={imagePriority}
            quality={85}
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
            {t("featured")}
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

      <div className="flex flex-1 flex-col">
        <CardHeader className="space-y-2 pb-2">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-brand-taupe">
            {t("tryOnEligible")}
          </p>
          <CardTitle className="min-h-[4.6rem] text-[1.8rem] leading-tight md:min-h-[5rem] md:text-[1.95rem]">
            <Link
              href={`/collections/${product.slug}`}
              className="line-clamp-2 transition-colors hover:text-primary"
            >
              {product.name}
            </Link>
          </CardTitle>
          <p className="min-h-[5.25rem] text-sm leading-relaxed text-muted-foreground">
            {truncate(product.description, 108)}
          </p>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="font-display text-[2rem] leading-none text-brand-cocoa">
            {formatCurrency(product.priceInCents, product.currency)}
          </p>
        </CardContent>

        <CardFooter className="mt-auto pt-2">
          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-2xl border-border/80 bg-background/75 px-4 text-[0.76rem] font-semibold normal-case tracking-[0.03em] shadow-none hover:border-brand-taupe/45 hover:bg-card/95 hover:shadow-editorial"
            >
              <Link href={`/collections/${product.slug}`}>
                <span>{t("viewGown")}</span>
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              className="h-11 rounded-2xl border border-brand-cocoa/10 bg-[linear-gradient(135deg,hsl(var(--brand-cocoa))_12%,hsl(var(--primary))_100%)] px-4 text-[0.76rem] font-semibold normal-case tracking-[0.03em] shadow-soft hover:border-brand-gold/25 hover:brightness-110 hover:shadow-luxury"
            >
              <Link href={`/book?productId=${product.id}`}>
                <CalendarDays className="size-3.5" aria-hidden="true" />
                <span>{t("bookTryOn")}</span>
              </Link>
            </Button>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
