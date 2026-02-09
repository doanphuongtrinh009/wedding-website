import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

const products = [
  {
    id: "aurora",
    name: "Aurora Silk A-Line",
    silhouette: "A-Line",
    price: "$2,850",
    note: "Hand draped bodice with cathedral train"
  },
  {
    id: "celeste",
    name: "Celeste Crepe Column",
    silhouette: "Column",
    price: "$3,120",
    note: "Sculpted waist and pearl button back"
  },
  {
    id: "elysian",
    name: "Elysian Lace Corset",
    silhouette: "Ball Gown",
    price: "$4,250",
    note: "French lace overlay and detachable sleeves"
  },
  {
    id: "seraphina",
    name: "Seraphina Satin Wrap",
    silhouette: "Fit & Flare",
    price: "$3,480",
    note: "Contoured seams with soft off-shoulder drape"
  }
] as const;

export function ProductGrid() {
  return (
    <section className="section-shell pt-0">
      <div className="mb-space-lg flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-4">
          <p className="editorial-kicker">Collections</p>
          <h2 className="max-w-2xl">
            Signature silhouettes, curated for private appointments.
          </h2>
        </div>
        <Button asChild variant="secondary" className="w-fit">
          <Link href="/collections">View all gowns</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {products.map((product, index) => (
          <Card key={product.id} variant="product" className="overflow-hidden">
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
                  {product.silhouette}
                </Badge>
              </div>
            </div>
            <CardHeader className="space-y-2 pb-4">
              <CardTitle className="text-[1.85rem] leading-tight">
                {product.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{product.note}</p>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="font-display text-3xl leading-none text-brand-cocoa">
                {product.price}
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Save preview
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
