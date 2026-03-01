import { motion } from "framer-motion";
import { imageVariants } from "./variants";

interface BookCoverProps {
  name: string;
  category: string;
  imageUrl?: string;
  badge?: string | null;
}

export function BookCover({ name, category, imageUrl, badge }: BookCoverProps) {
  return (
    <motion.div
      variants={imageVariants}
      initial="hidden"
      animate="visible"
      className="relative"
    >
      {/* Badge */}
      {badge && (
        <motion.span
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="absolute -top-3 -right-3 z-10 bg-white text-black font-sans text-[10px] font-medium tracking-[0.15em] uppercase px-3 py-1"
        >
          {badge}
        </motion.span>
      )}

      {/* Image frame */}
      <div className="relative aspect-[3/4] w-full max-w-sm mx-auto border border-white/[0.08] overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-white/[0.06] to-white/[0.02] flex flex-col items-center justify-center gap-3">
            <span
              className="font-black text-white/10 select-none"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(80px,12vw,120px)" }}
            >
              F
            </span>
            <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/20">
              {category}
            </span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      </div>

      <div
        aria-hidden="true"
        className="absolute -bottom-6 -right-6 w-48 h-48 rounded-full border border-white/[0.04] pointer-events-none -z-10"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-12 -right-12 w-72 h-72 rounded-full border border-white/[0.02] pointer-events-none -z-10"
      />
    </motion.div>
  );
}
