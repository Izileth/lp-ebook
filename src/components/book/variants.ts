import type { Variants } from "framer-motion";

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1], delay },
  }),
};

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

export const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, x: -20 },
  visible: {
    opacity: 1, scale: 1, x: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
  },
};
