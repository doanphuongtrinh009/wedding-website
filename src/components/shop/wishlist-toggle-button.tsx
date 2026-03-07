"use client";

import { Heart } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { useState, useTransition } from "react";

import { toggleWishlistAction } from "@/actions/shop-actions";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast-system";
import { getLocalizedPath } from "@/lib/localized-paths";
import { cn } from "@/lib/utils";

type WishlistToggleButtonProps = {
  productId: string;
  initialWishlisted: boolean;
  className?: string;
};

export function WishlistToggleButton({
  productId,
  initialWishlisted,
  className
}: WishlistToggleButtonProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
  const { toast } = useToast();
  const t = useTranslations("Wishlist");

  const buttonLabel = isWishlisted
    ? t("removeFromWishlist")
    : t("addToWishlist");

  function onToggle() {
    startTransition(async () => {
      try {
        const result = await toggleWishlistAction({
          productId,
          isWishlisted,
          locale,
          returnTo: pathname
        });

        if (result.status === "signed_out") {
          router.push({
            pathname: "/sign-in",
            query: {
              redirect_url: getLocalizedPath(locale, pathname)
            }
          });
          return;
        }

        if (result.status === "error") {
          toast({
            title: t("actionFailed"),
            description: result.message,
            tone: "destructive"
          });
          return;
        }

        if (result.status === "ok") {
          setIsWishlisted(result.wishlisted);
          router.refresh();
        }
      } catch {
        toast({
          title: t("actionFailed"),
          description: t("tryAgain"),
          tone: "destructive"
        });
      }
    });
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={buttonLabel}
      aria-pressed={isWishlisted}
      disabled={isPending}
      onClick={onToggle}
      className={cn(
        "h-10 w-10 rounded-full border border-border/80 bg-background/80 p-0 normal-case tracking-normal",
        className
      )}
    >
      <Heart
        className={cn(
          "size-4",
          isWishlisted ? "fill-primary text-primary" : "text-muted-foreground"
        )}
      />
    </Button>
  );
}
