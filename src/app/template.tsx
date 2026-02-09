"use client";

import { usePathname } from "next/navigation";
import { domAnimation, LazyMotion, m } from "framer-motion";

import { pageFadeRise } from "@/components/motion/variants";

export default function Template({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <LazyMotion features={domAnimation}>
            <m.main
                key={pathname}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageFadeRise}
                className="flex min-h-[calc(100vh-64px)] flex-col"
            >
                {children}
            </m.main>
        </LazyMotion>
    );
}
