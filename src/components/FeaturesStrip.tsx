// src/components/FeaturesStrip.tsx
import { motion } from "framer-motion";
import { IconZap, IconShield, IconMail, IconStar } from "./Icons";

export function FeaturesStrip() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="border-y border-white/[0.05] py-6 px-10 overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto flex flex-wrap justify-center md:justify-between gap-6">
        {[
          { icon: <IconZap />,    text: "Entrega Imediata"      },
          { icon: <IconShield />, text: "Pagamento Seguro"      },
          { icon: <IconMail />,   text: "Enviado por E-mail"    },
          { icon: <IconStar />,   text: "Avaliação 4.9 / 5.0"   },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-3 text-white/40 hover:text-white/70 transition-colors">
            <span className="text-white/30">{icon}</span>
            <span className="font-sans text-[12px] tracking-[0.1em] uppercase">{text}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
