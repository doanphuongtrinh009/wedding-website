"use client";

import { AnimatePresence, m, MotionConfig } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { getOptimizedCloudinaryUrl } from "@/lib/image";

type LightboxImage = {
    id: string;
    secureUrl: string;
    altText: string | null;
};

interface LightboxProps {
    images: LightboxImage[];
    initialIndex: number;
    isOpen: boolean;
    onClose: () => void;
}

export function Lightbox({
    images,
    initialIndex,
    isOpen,
    onClose
}: LightboxProps) {
    const [index, setIndex] = useState(initialIndex);
    const [direction, setDirection] = useState(0);

    const paginate = useCallback((newDirection: number) => {
        setDirection(newDirection);
        setIndex((prev) => {
            if (images.length === 0) {
                return prev;
            }

            let next = prev + newDirection;
            if (next < 0) next = images.length - 1;
            if (next >= images.length) next = 0;
            return next;
        });
    }, [images.length]);

    useEffect(() => {
        if (isOpen) {
            setIndex(initialIndex);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen, initialIndex]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") paginate(-1);
            if (e.key === "ArrowRight") paginate(1);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose, paginate]);

    if (!isOpen) return null;

    return (
        <MotionConfig transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}>
            <AnimatePresence>
                {isOpen && (
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-sm"
                        onClick={onClose}
                    >
                        {/* Controls */}
                        <div className="absolute right-4 top-4 z-50 flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 text-white/70 hover:bg-white/10 hover:text-white"
                                onClick={onClose}
                            >
                                <X className="h-6 w-6" />
                                <span className="sr-only">Close</span>
                            </Button>
                        </div>

                        {/* Navigation */}
                        {images.length > 1 && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute left-4 top-1/2 z-50 h-12 w-12 -translate-y-1/2 rounded-full text-white/70 hover:bg-white/10 hover:text-white max-sm:hidden"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        paginate(-1);
                                    }}
                                >
                                    <ChevronLeft className="h-8 w-8" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-4 top-1/2 z-50 h-12 w-12 -translate-y-1/2 rounded-full text-white/70 hover:bg-white/10 hover:text-white max-sm:hidden"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        paginate(1);
                                    }}
                                >
                                    <ChevronRight className="h-8 w-8" />
                                </Button>
                            </>
                        )}

                        {/* Image */}
                        <div
                            className="relative h-full w-full max-w-7xl p-4 md:p-10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <AnimatePresence initial={false} custom={direction} mode="wait">
                                <m.div
                                    key={index}
                                    custom={direction}
                                    initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: direction < 0 ? 50 : -50 }} // Exit opposite direction
                                    className="relative h-full w-full"
                                >
                                    <Image
                                        src={getOptimizedCloudinaryUrl(images[index].secureUrl, {
                                            width: 1600, // HD quality
                                            quality: 90,
                                            crop: "fit"
                                        })}
                                        alt={images[index].altText || "Product image"}
                                        fill
                                        className="object-contain" // Contain to show full dress
                                        priority
                                        sizes="100vw"
                                    />
                                </m.div>
                            </AnimatePresence>
                        </div>

                        {/* Mobile Swipe hints or Counter */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/50">
                            {index + 1} / {images.length}
                        </div>

                    </m.div>
                )}
            </AnimatePresence>
        </MotionConfig>
    );
}
