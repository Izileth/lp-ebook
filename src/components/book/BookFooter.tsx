import { motion } from "framer-motion";

export function BookFooter() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="px-8 md:px-16 py-10 border-t border-white/[0.05] flex flex-wrap items-center justify-between gap-4"
    >
      <div className="flex items-baseline gap-2">
        <span
          className="font-bold"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: 16 }}
        >
          FOCUS
        </span>
        <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/20">
          | Conhecimento
        </span>
      </div>
      <p className="font-sans text-[11px] text-white/20 tracking-wide">
        © 2025 Focus Conhecimento. Todos os direitos reservados.
      </p>
    </motion.footer>
  );
}
