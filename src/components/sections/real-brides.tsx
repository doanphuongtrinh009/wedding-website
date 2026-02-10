"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Placeholder data - In production this would come from CMS or config
const brides = [
    {
        id: "1",
        name: "Minh Anh",
        location: "Da Lat, Vietnam",
        image: "/images/bridal/boutique-interior.png", // Placeholder
        testimonial: "The dress was everything I dreamed of.",
        gridArea: "md:col-span-2 md:row-span-2",
    },
    {
        id: "2",
        name: "Sarah Jenkins",
        location: "Sydney, Australia",
        image: "/images/bridal/boutique-interior.png", // Placeholder
        testimonial: "Simple, elegant, and timeless.",
        gridArea: "md:col-span-1 md:row-span-1",
    },
    {
        id: "3",
        name: "Lan Huong",
        location: "Hanoi, Vietnam",
        image: "/images/bridal/boutique-interior.png", // Placeholder
        testimonial: "Perfect fit for my intimate ceremony.",
        gridArea: "md:col-span-1 md:row-span-1",
    }
];

export function RealBrides() {
    const t = useTranslations("RealBrides");

    return (
        <section className="section-shell">
            <div className="mb-12 flex flex-col items-center text-center space-y-4">
                <span className="editorial-kicker">{t("label")}</span>
                <h2 className="text-4xl md:text-5xl">{t("title")}</h2>
                <p className="max-w-xl text-muted-foreground">{t("subtitle")}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2 h-[600px] md:h-[600px]">
                {brides.map((bride) => (
                    <div
                        key={bride.id}
                        className={cn(
                            "relative group overflow-hidden rounded-2xl bg-secondary/20",
                            bride.gridArea
                        )}
                    >
                        <Image
                            src={bride.image}
                            alt={`Bride ${bride.name} in Quỳnh Trâm Bridal`}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-6 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <p className="font-display text-xl">{bride.name}</p>
                            <p className="text-xs uppercase tracking-wider opacity-90">{bride.location}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-10 flex justify-center">
                <Button asChild variant="outline" size="lg">
                    <Link href="/collections">{t("cta")}</Link>
                </Button>
            </div>
        </section>
    );
}
