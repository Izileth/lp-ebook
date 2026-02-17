// src/components/ContactSection.tsx
import { motion } from "framer-motion";
import { fadeUpVariants, staggerContainer } from "../motionVariants";
import { IconMail } from "./Icons";

export function ContactSection() {
  return (
    <section id="contato" className="px-10 py-[100px] border-b border-white/[0.05]">
      <div className="max-w-[1200px] mx-auto text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.p
            variants={fadeUpVariants}
            className="font-sans text-[11px] tracking-[0.25em] uppercase text-white/30 mb-3"
          >
            Fale Conosco
          </motion.p>
          <motion.h2
            variants={fadeUpVariants}
            className="[font-family:'Playfair_Display',serif] font-bold leading-[1.1] mb-8"
            style={{ fontSize: "clamp(32px,5vw,56px)" }}
          >
            Entre em
            <br />
            <em className="not-italic">Contato</em>
          </motion.h2>

          <motion.div variants={fadeUpVariants} className="flex flex-col items-center gap-4 text-white/70 font-sans text-base">
            <p>Se tiver alguma dúvida ou precisar de suporte, entre em contato:</p>
            <a
              href="mailto:contato@focusconhecimento.com"
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors underline"
            >
              <IconMail /> contato@focusconhecimento.com
            </a>
            <p className="mt-4">Responderemos o mais breve possível.</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
