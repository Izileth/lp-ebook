// src/components/Header.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NAV_LINKS } from "../constants";
import { IconMenu, IconArrowRight } from "./Icons";

interface HeaderProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export function Header({ menuOpen, setMenuOpen }: HeaderProps) {
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={[
        "fixed top-0 left-0 right-0 z-[100] h-16 flex items-center justify-between px-10",
        "transition-[background,border-color,backdrop-filter] duration-500",
        scrolled
          ? "border-b border-white/[0.08] bg-black/90 backdrop-blur-xl"
          : "border-b border-transparent",
      ].join(" ")}
    >
      {/* Logo */}
      <div className="flex items-baseline gap-2">
        <span className="[font-family:'Playfair_Display',serif] text-xl font-bold tracking-[0.02em] flex items-center">
          F
          <img
            src="/src/assets/favicons.png"
            alt="Logo FOCUS"
            className="h-7 w-7 object-contain"
          />
          CUS
        </span>

        <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-white/30">
          | Conhecimento
        </span>
      </div>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-10">
        {NAV_LINKS.map((item) => (
          <a
            key={item}
            href={item === "Ebooks" ? "#livros" : `#${item.toLowerCase()}`}
            className="font-sans text-[13px] tracking-[0.12em] uppercase text-white/55 no-underline hover:text-white transition-colors duration-200"
          >
            {item}
          </a>))}
        <motion.a
          href="#livros"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="bg-white text-black font-sans text-[12px] font-medium tracking-[0.1em] uppercase px-5 py-2.5 flex items-center gap-2 hover:bg-white/85 transition-colors"
        >
          Explorar <IconArrowRight />
        </motion.a>
      </nav>

      {/* Hamburger */}
      <button
        aria-label="Abrir menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(true)}
        className="md:hidden text-white bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity"
      >
        <IconMenu />
      </button>
    </motion.header>
  );
}
