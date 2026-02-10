"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

const productPrices = {
  aurora: "$2,850",
  celeste: "$3,120",
  elysian: "$4,250",
  seraphina: "$3,480"
} as const;

type ProductId = keyof typeof productPrices;

export function ProductGrid() {
  const t = useTranslations("CollectionsGrid");
  const productIds = Object.keys(productPrices) as ProductId[];

  return (
    <section className="section-shell pt-0">
      <div className="mb-space-lg flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-4">
          <p className="editorial-kicker">{t("kicker")}</p>
          <h2 className="max-w-2xl">{t("heading")}</h2>
        </div>
        <Button asChild variant="secondary" className="w-fit">
          <Link href="/collections">{t("viewAll")}</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {productIds.map((id, index) => (
          <Card key={id} variant="product" className="overflow-hidden">
            <div
              className="relative aspect-[4/5] border-b border-border/70"
              style={{
                backgroundImage:
                  index % 2 === 0
                    ? "linear-gradient(155deg, rgba(255, 250, 245, 1) 15%, rgba(242, 224, 214, 0.95) 100%)"
                    : "linear-gradient(160deg, rgba(255, 252, 248, 1) 20%, rgba(231, 212, 195, 0.96) 100%)"
              }}
            >
              <div className="absolute inset-x-4 bottom-4">
                <Badge
                  variant="outline"
                  className="bg-background/70 backdrop-blur"
                >
                  {t(`products.${id}.silhouette`)}
                </Badge>
              </div>
            </div>
            <CardHeader className="space-y-2 pb-4">
              <CardTitle className="text-[1.85rem] leading-tight">
                {t(`products.${id}.name`)}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {t(`products.${id}.note`)}
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="font-display text-3xl leading-none text-brand-cocoa">
                {productPrices[id]}
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                {t("savePreview")}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
