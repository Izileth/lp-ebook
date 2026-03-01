import { motion } from "framer-motion";
import { ProfileAvatar } from "./ProfileAvatar";
import { stagger, fadeUp } from "./variants";

interface ProfileHeaderProps {
  name: string;
}

export function ProfileHeader({ name }: ProfileHeaderProps) {
  return (
    <motion.header
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="mb-14"
    >
      <motion.div variants={fadeUp} className="flex items-end gap-5">
        <ProfileAvatar name={name} />
        <div className="flex flex-col gap-1 pb-1">
          <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/35 border-l-2 border-white/20 pl-3">
            Perfil do usuário
          </span>
          <h1
            className="[font-family:'Playfair_Display',serif] font-bold leading-[1.05] tracking-[-0.02em]"
            style={{ fontSize: "clamp(28px,4vw,46px)" }}
          >
            Personalize sua
            <br />
            <em className="not-italic text-white/60">experiência.</em>
          </h1>
        </div>
      </motion.div>
    </motion.header>
  );
}
