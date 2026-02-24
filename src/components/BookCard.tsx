// src/components/BookCard.tsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { Product } from "../types";
import { cardVariants } from "../motionVariants";
import { IconBook, IconArrowRight } from "./Icons";

interface BookCardProps {
  book: Product;
  index: number;
}

export function BookCard({ book, index }: BookCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/ebook/${book.id}`);
  };

  const handleCheckout = () => {
    window.location.href = book.checkoutUrl;
  };

  const imageUrl = book.product_images?.[0]?.image_url || '/placeholder.jpg'; // Use a placeholder if no image

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      whileHover={{ y: -6, borderColor: "rgba(255,255,255,0.28)" }}
      className="relative border border-white/[0.08] bg-[#0a0a0a] p-8 cursor-pointer group"
      style={{ transition: "border-color 0.25s" }}
      onClick={handleCardClick}
    >
      {book.badge !== null && (
        <span className="absolute top-5 right-5 bg-white text-black font-sans text-[10px] tracking-[0.15em] uppercase px-2.5 py-0.5 z-10">
          {book.badge}
        </span>
      )}

      {/* Cover */}
      <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.06] mb-6 flex items-center justify-center overflow-hidden">
        <img 
          src={imageUrl} 
          alt={book.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Subtle category watermark */}
        <span className="absolute bottom-4 left-4 font-sans text-[9px] tracking-[0.2em] uppercase text-white/40 bg-black/40 px-2 py-0.5 backdrop-blur-sm">
          {book.category}
        </span>
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
      </div>

      <p className="font-sans text-[10px] tracking-[0.18em] uppercase text-white/40 mb-2 flex items-center gap-1.5">
        <span className="text-white/25"><IconBook /></span>
        {book.category}
      </p>
      <h3 className="[font-family:'Playfair_Display',serif] text-[18px] font-bold leading-[1.25] mb-4">
        {book.name}
      </h3>

      <div className="flex items-center justify-between mb-5">
        <span className="font-sans text-[11px] text-white/35 tracking-wide">{book.pages}</span>
        <span className="[font-family:'Playfair_Display',serif] text-lg font-bold">{book.price}</span>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-white text-black font-sans text-[12px] font-medium tracking-[0.1em] uppercase py-3 flex items-center justify-center gap-2 transition-colors duration-200 hover:bg-white/85"
        onClick={(e) => {
          e.stopPropagation();
          handleCheckout();
        }}
      >
        Adquirir
        <IconArrowRight />
      </motion.button>
    </motion.article>
  );
}
