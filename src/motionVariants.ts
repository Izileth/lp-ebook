// src/motionVariants.ts
import type { Variants } from "framer-motion";

export const fadeUpVariants: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
};

export const staggerContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

export const slideIn: Variants = {
  hidden:  { x: "100%" },
  visible: { x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit:    { x: "100%", transition: { duration: 0.35, ease: [0.7, 0, 1, 1] } },
};

export const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 },
  }),
};
