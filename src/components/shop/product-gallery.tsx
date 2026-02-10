"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState } from "react";

import { motionEase, motionTimings } from "@/components/motion/variants";
import { getOptimizedCloudinaryUrl } from "@/lib/image";
import { Lightbox } from "@/components/ui/lightbox";
import { cn } from "@/lib/utils";

type GalleryImage = {
  id: string;
  secureUrl: string;
  altText: string | null;
};

type ProductGalleryProps = {
  images: GalleryImage[];
  productName: string;
};

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const activeImage = images[activeIndex];
  const galleryImages = useMemo(() => images.slice(0, 7), [images]);

  if (!activeImage) {
    return (
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border/70 bg-secondary/40" />
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border/70 bg-secondary/40">
        <AnimatePresence initial={false} mode="wait">
          <m.div
            key={activeImage.id}
            className="absolute inset-0 z-10 cursor-zoom-in"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.99 }}
            transition={{ duration: motionTimings.base, ease: motionEase }}
            onClick={() => {
              console.log("Main Image Clicked");
              setLightboxOpen(true);
            }}
          >
            <Image
              src={getOptimizedCloudinaryUrl(activeImage.secureUrl, {
                width: 1400,
                quality: 84,
                crop: "fill"
              })}
              alt={activeImage.altText || productName}
              fill
              className="object-cover"
              priority={activeIndex === 0}
              fetchPriority={activeIndex === 0 ? "high" : "auto"}
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </m.div>
        </AnimatePresence>

        {/* Zoom Indicator */}
        <div className="absolute right-4 top-4 z-20 pointer-events-none rounded-full bg-black/40 p-2 text-white/90 backdrop-blur-sm transition-opacity hover:bg-black/60">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-expand"
          >
            <path d="m21 21-6-6" />
            <path d="M3 11v-4a4 4 0 0 1 4-4h4" />
            <path d="M13 3h4a4 4 0 0 1 4 4v4" />
            <path d="M11 13H7a4 4 0 0 0-4 4v4" />
            <path d="M13 21h4a4 4 0 0 0 4-4v-4" />
          </svg>
        </div>
      </div>

      {galleryImages.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {galleryImages.map((image, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "group relative aspect-square overflow-hidden rounded-xl border bg-secondary/30 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive
                    ? "border-primary shadow-soft"
                    : "border-border/70 hover:border-primary/45"
                )}
                aria-label={`View image ${index + 1}`}
                aria-pressed={isActive}
              >
                <Image
                  src={getOptimizedCloudinaryUrl(image.secureUrl, {
                    width: 360,
                    height: 360,
                    quality: 72,
                    crop: "fill"
                  })}
                  alt={image.altText || productName}
                  fill
                  className="object-cover transition duration-300 motion-safe:group-hover:scale-[1.03]"
                  loading="lazy"
                  sizes="(max-width: 1024px) 25vw, 10vw"
                />
              </button>
            );
          })}
        </div>
      ) : null}

      <Lightbox
        images={images}
        initialIndex={activeIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
