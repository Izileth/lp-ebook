import type { Variants } from "framer-motion";

export const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export const slideDown: Variants = {
  hidden:  { opacity: 0, y: -8, height: 0 },
  visible: { opacity: 1, y: 0,  height: "auto", transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: -6, height: 0,       transition: { duration: 0.22 } },
};
