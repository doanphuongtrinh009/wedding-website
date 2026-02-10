
import Image from "next/image";

import { cn } from "@/lib/utils";

export default function AboutPage() {
  return (
    <section className="section-shell space-y-16 md:space-y-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <p className="editorial-kicker">Our Heritage</p>
          <h1 className="text-4xl leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            Modern couture, <br className="hidden lg:block" />
            intimate service.
          </h1>
          <p className="max-w-prose text-lg text-muted-foreground leading-relaxed">
            Maison Etoile is a bridal atelier focused on modern silhouettes,
            private fittings, and personalized styling guidance from first
            appointment to final alteration.
          </p>
          <p className="max-w-prose text-base text-muted-foreground">
            Every gown consultation is tailored to your ceremony timeline, venue
            setting, and comfort preferences to ensure a confident and refined
            wedding-day fit.
          </p>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl md:aspect-square lg:aspect-[4/5]">
          <Image
            src="/images/bridal/boutique-interior.png"
            alt="Maison Etoile Bridal Boutique Interior"
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      </div>
    </section>
  );
}
