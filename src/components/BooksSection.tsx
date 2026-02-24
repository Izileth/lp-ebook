// src/components/BooksSection.tsx
import { motion } from "framer-motion";
import { fadeUpVariants, staggerContainer } from "../motionVariants";
import { IconBook, IconArrowRight } from "./Icons";
import { BookCard } from "./BookCard";
import { useProducts } from "../hooks/useProducts";
import { LoadingState, ErrorState } from "./ui/StatesScreens";
import type { Product } from "../types";

export function BooksSection() {
  const { products, loading, error } = useProducts();

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error}/>;
  }

  return (
    <section id="livros" className="px-10 py-[100px] border-b border-white/[0.05]">
      <div className="max-w-[1200px] mx-auto">

        {/* Section header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex justify-between items-end mb-16 flex-wrap gap-6"
        >
          <div>
            <motion.p
              variants={fadeUpVariants}
              className="font-sans text-[11px] tracking-[0.25em] uppercase text-white/30 mb-3 flex items-center gap-2"
            >
              <span className="text-white/20"><IconBook /></span>
              Catálogo
            </motion.p>
            <motion.h2
              variants={fadeUpVariants}
              className="[font-family:'Playfair_Display',serif] font-bold leading-[1.1]"
              style={{ fontSize: "clamp(32px,5vw,56px)" }}
            >
              Nossos
              <br />
              <em className="not-italic">Títulos</em>
            </motion.h2>
          </div>

          <motion.a
            variants={fadeUpVariants}
            href="#"
            whileHover={{ scale: 1.02 }}
            className="border border-white/25 text-white font-sans text-[13px] tracking-[0.1em] uppercase px-7 py-3.5 flex items-center gap-2 hover:border-white/60 hover:bg-white/[0.04] transition-[border-color,background]"
          >
            Ver todos <IconArrowRight />
          </motion.a>
        </motion.div>

        <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
          {products.map((book: Product, i: number) => (
            <BookCard key={book.id} book={book} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
