import type { Transition, Variants } from "framer-motion";

export const motionTimings = {
  fast: 0.2,
  base: 0.3,
  slow: 0.38,
  stagger: 0.08
} as const;

export const motionEase: Transition["ease"] = [0.22, 1, 0.36, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.992 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: motionTimings.base, ease: motionEase }
  }
};

export const staggerContainer = (
  staggerChildren: number = motionTimings.stagger,
  delayChildren: number = 0
): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
      delayChildren
    }
  }
});

export const pageFadeRise: Variants = {
  initial: { opacity: 0, y: 6 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: motionTimings.base, ease: motionEase }
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: motionTimings.fast, ease: motionEase }
  }
};

export const toastMotion: Variants = {
  initial: { opacity: 0, y: 12, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: motionTimings.fast, ease: motionEase }
  },
  exit: {
    opacity: 0,
    y: 8,
    scale: 0.99,
    transition: { duration: 0.18, ease: motionEase }
  }
};
