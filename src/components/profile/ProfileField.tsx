import { motion } from "framer-motion";
import { fadeUp } from "./variants";

interface ProfileFieldProps {
  id: string;
  label: string;
  hint?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export function ProfileField({ id, label, hint, icon, children }: ProfileFieldProps) {
  return (
    <motion.div variants={fadeUp} className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="font-sans text-[10px] tracking-[0.22em] uppercase text-white/40 font-medium"
      >
        {label}
      </label>
      <div className="relative flex items-start border border-white/[0.1] transition-[border-color] duration-200 focus-within:border-white/30 group">
        <span className="absolute left-4 top-[17px] text-white/25 pointer-events-none group-focus-within:text-white/45 transition-colors duration-200">
          {icon}
        </span>
        {children}
      </div>
      {hint && (
        <p className="font-sans text-[10px] italic text-white/20 leading-relaxed">{hint}</p>
      )}
    </motion.div>
  );
}
