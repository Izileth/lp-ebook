import React from "react";
import { motion} from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import favicon from "../assets/favicon.jpg";

interface SplashLogoProps extends HTMLMotionProps<"div"> {
  useFavicon?: boolean;
}

const SplashLogo: React.FC<SplashLogoProps> = ({ useFavicon = true, ...motionProps }) => {
  return (
    <motion.div
      {...motionProps}
      className="relative z-10 flex flex-col items-center mb-16"
    >
      {useFavicon ? (
        <img src={favicon} alt="Focus" className="w-32 h-32 mb-3" />
      ) : (
        <>
          {/* Logotype */}
          <div className="flex items-baseline gap-3 mb-3">
            <span
              className="font-black tracking-[0.02em] text-white"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(40px,6vw,64px)" }}
            >
              FOCUS
            </span>
            <span
              className="font-light tracking-[0.22em] uppercase text-white/35"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(11px,1.2vw,14px)" }}
            >
              | Conhecimento
            </span>
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="text-white/30 tracking-[0.3em] uppercase"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10 }}
          >
            Plataforma de ebooks
          </motion.p>
        </>
      )}
    </motion.div>
  );
};

export default SplashLogo;
