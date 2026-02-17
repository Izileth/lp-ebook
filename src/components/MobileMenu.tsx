// src/components/MobileMenu.tsx
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { slideIn, staggerContainer, fadeUpVariants } from "../motionVariants";
import { NAV_LINKS } from "../constants";
import { IconX, IconArrowRight } from "./Icons";

interface MobileMenuProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export function MobileMenu({ menuOpen, setMenuOpen }: MobileMenuProps) {
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          key="mobile-menu"
          variants={slideIn}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
          className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-center gap-10"
        >
          <button
            aria-label="Fechar menu"
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 text-white bg-transparent border-none cursor-pointer hover:opacity-60 transition-opacity"
          >
            <IconX />
          </button>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center gap-8"
          >
            {NAV_LINKS.map((item) => (
              <motion.a
                key={item}
                variants={fadeUpVariants}
                href="#"
                onClick={() => setMenuOpen(false)}
                className="[font-family:'Playfair_Display',serif] text-4xl text-white/60 no-underline hover:text-white transition-colors duration-200"
              >
                {item}
              </motion.a>
            ))}

            <motion.a
              variants={fadeUpVariants}
              href="#livros"
              onClick={() => setMenuOpen(false)}
              className="mt-4 bg-white text-black font-sans text-[13px] font-medium tracking-[0.1em] uppercase px-8 py-3.5 flex items-center gap-2 hover:bg-white/85 transition-colors"
            >
              Ver Catálogo <IconArrowRight />
            </motion.a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
