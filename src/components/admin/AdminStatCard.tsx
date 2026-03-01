import { motion } from "framer-motion";
import { fadeUp } from "./AdminVariants";

interface AdminStatCardProps {
  icon:  React.ReactNode;
  label: string;
  value: string;
}

export function AdminStatCard({ icon, label, value }: AdminStatCardProps) {
  return (
    <motion.div
      variants={fadeUp}
      className="border border-white/[0.08] bg-white/[0.02] px-6 py-5 flex items-center gap-4"
    >
      <div className="text-white/25 shrink-0">{icon}</div>
      <div className="flex flex-col gap-0.5">
        <span className="font-sans text-[10px] tracking-[0.18em] uppercase text-white/35">{label}</span>
        <span
          className="[font-family:'Playfair_Display',serif] font-bold text-white"
          style={{ fontSize: "clamp(18px,2vw,24px)" }}
        >
          {value}
        </span>
      </div>
    </motion.div>
  );
}
