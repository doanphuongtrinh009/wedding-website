"use client";

import { usePathname } from "@/i18n/routing";
import { AnimatePresence, domAnimation, LazyMotion, m } from "framer-motion";

import { pageFadeRise } from "@/components/motion/variants";

export default function Template({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <LazyMotion features={domAnimation}>
            <AnimatePresence mode="popLayout" initial={false}>
                <m.div
                    key={pathname}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageFadeRise}
                    className="flex min-h-[calc(100vh-64px)] flex-col"
                >
                    {children}
                </m.div>
            </AnimatePresence>
        </LazyMotion>
    );
}
