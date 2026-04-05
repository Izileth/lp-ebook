import { useRef } from "react";
import { motion, useInView} from "framer-motion";
import {
  IconQuote, IconTrendingUp, IconZap, IconAward,
  IconCheckCircle, IconShield, IconUser,
} from "./Icons";

import type { Variants } from "framer-motion";

// ─── Motion Variants ──────────────────────────────────────────────────────────

const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
};

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 32, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.7, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] },
  }),
};

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Person {
  name:    string;
  role:    string;
  quotes:  string[];
  lesson:  string;
  index:   string; // 01, 02 …
  icon:    React.ReactNode;
}

const PEOPLE: Person[] = [
  {
    name: "Tony Montana", role: "Scarface", index: "01",
    icon: <IconShield size={16} />,
    quotes: [
      "Tudo que tenho neste mundo são minhas palavras e minha coragem.",
      "Os olhos, cara — eles nunca mentem.",
      "Todo homem tem seu dia.",
    ],
    lesson: "Honra, inteligência e visão são as verdadeiras armas que levam alguém do nada ao topo.",
  },
  {
    name: "Jordan Belfort", role: "The Wolf of Wall Street", index: "02",
    icon: <IconTrendingUp size={16} />,
    quotes: [
      "A única coisa entre você e seu objetivo é a história que continua se contando.",
      "Aja como um homem rico e confiante, e você se tornará um.",
      "Vencedores usam 'eu vou'. Perdedores usam 'eu tento'.",
    ],
    lesson: "Dominar a mente, vendas e persuasão permite mudar completamente sua realidade.",
  },
  {
    name: "Tyler Durden", role: "Fight Club", index: "03",
    icon: <IconZap size={16} />,
    quotes: [
      "Só depois de perdermos tudo é que somos livres para qualquer coisa.",
      "As coisas que você possui acabam possuindo você.",
      "Destruir velhos padrões é às vezes o verdadeiro caminho.",
    ],
    lesson: "Quebrar padrões mentais impostos pela sociedade liberta a mente para criar novos caminhos.",
  },
  {
    name: "Grandes Generais", role: "Kingdom", index: "04",
    icon: <IconAward size={16} />,
    quotes: [
      "Um grande general vence a guerra antes da batalha começar.",
      "A força ganha batalhas, mas a estratégia conquista reinos.",
      "Quem entende o campo vence mesmo sendo o mais fraco.",
    ],
    lesson: "Conhecimento estratégico e antecipação sempre superam a força bruta.",
  },
  {
    name: "Elon Musk", role: "Inovação Tecnológica", index: "05",
    icon: <IconZap size={16} />,
    quotes: [
      "Quando algo é importante o suficiente, você faz mesmo contra as probabilidades.",
      "Você precisa abraçar a mudança se a alternativa for o desastre.",
      "Penso em princípios fundamentais, não por analogia.",
    ],
    lesson: "Pensar profundamente e aprender constantemente é o que permite quebrar limites.",
  },
  {
    name: "Warren Buffett", role: "Estratégia Financeira", index: "06",
    icon: <IconCheckCircle size={16} />,
    quotes: [
      "Quanto mais você aprende, mais você ganha.",
      "O melhor investimento que pode fazer é em você mesmo.",
      "O risco vem de não saber o que você está fazendo.",
    ],
    lesson: "Conhecimento financeiro e aprendizado contínuo são a base para riqueza perene.",
  },
  {
    name: "Steve Jobs", role: "Visão Criativa", index: "07",
    icon: <IconUser size={16} />,
    quotes: [
      "Continue com fome, continue tolo.",
      "A inovação distingue um líder de um seguidor.",
      "Quem é louco o suficiente para pensar que muda o mundo, realmente o faz.",
    ],
    lesson: "Criatividade, visão e conhecimento profundo podem transformar indústrias inteiras.",
  },
];

const PATTERNS = [
  "Conhecimento gera vantagem assimétrica",
  "Pensamento profundo cria inovação real",
  "Aprendizado constante multiplica resultados",
  "Quem pensa diferente, lidera",
];

// ─── PersonCard ───────────────────────────────────────────────────────────────

function PersonCard({ person, i }: { person: Person; i: number }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      custom={i}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="group relative border border-white/[0.07] bg-white/[0.015] hover:border-white/[0.18] hover:bg-white/[0.03] transition-[border-color,background] duration-500 flex flex-col overflow-hidden"
    >
      {/* Index watermark */}
      <span
        aria-hidden="true"
        className="absolute top-4 right-5 [font-family:'Playfair_Display',serif] font-black text-white/[0.04] group-hover:text-white/[0.07] transition-colors duration-500 select-none leading-none"
        style={{ fontSize: "clamp(48px,7vw,72px)" }}
      >
        {person.index}
      </span>

      {/* Quote icon */}
      <div className="absolute top-5 right-6 text-white/[0.04] group-hover:text-white/[0.08] transition-colors duration-500 pointer-events-none">
        <IconQuote size={36} />
      </div>

      {/* Top accent line */}
      <motion.div
        className="absolute top-0 left-0 h-px bg-gradient-to-r from-white/0 via-white/30 to-white/0 w-full"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.9, delay: i * 0.07 + 0.2, ease: [0.16, 1, 0.3, 1] }}
      />

      <div className="relative z-10 p-7 flex flex-col gap-6 flex-1">

        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-9 h-9 shrink-0 border border-white/[0.1] bg-white/[0.03] flex items-center justify-center text-white/35 group-hover:border-white/25 group-hover:text-white/55 transition-[border-color,color] duration-300">
            {person.icon}
          </div>
          <div className="flex flex-col gap-0.5">
            <h4
              className="[font-family:'Playfair_Display',serif] font-bold text-white leading-tight"
              style={{ fontSize: "clamp(16px,1.8vw,20px)" }}
            >
              {person.name}
            </h4>
            <p className="font-sans text-[9px] tracking-[0.22em] uppercase text-white/30">
              {person.role}
            </p>
          </div>
        </div>

        {/* Quotes */}
        <div className="flex flex-col gap-3 flex-1">
          {person.quotes.map((q, qi) => (
            <div key={qi} className="flex gap-3 items-start">
              <span className="text-white/15 shrink-0 mt-[5px] text-[8px]">◆</span>
              <p
                className="[font-family:'Playfair_Display',serif] italic text-white/50 leading-[1.65] group-hover:text-white/65 transition-colors duration-300"
                style={{ fontSize: "clamp(12px,1.1vw,14px)" }}
              >
                "{q}"
              </p>
            </div>
          ))}
        </div>

        {/* Lesson */}
        <div className="border-t border-white/[0.06] pt-5 flex flex-col gap-2">
          <span className="font-sans text-[8px] tracking-[0.3em] uppercase text-white/20">
            A lição
          </span>
          <p className="font-sans font-light text-[12px] leading-[1.7] text-white/40 group-hover:text-white/55 transition-colors duration-300">
            {person.lesson}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Summary card ─────────────────────────────────────────────────────────────

function SummaryCard({ i }: { i: number }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      custom={i}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="relative border border-white/[0.12] bg-white/[0.025] p-7 flex flex-col justify-between overflow-hidden"
    >
      {/* Radial glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,255,255,0.04)_0%,transparent_70%)] pointer-events-none"
      />
      {/* Top accent */}
      <motion.div
        className="absolute top-0 left-0 h-px bg-gradient-to-r from-white/0 via-white/40 to-white/0 w-full"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1, delay: i * 0.07 + 0.3, ease: [0.16, 1, 0.3, 1] }}
      />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Icon */}
        <div className="w-11 h-11 border border-white/[0.15] bg-white/[0.05] flex items-center justify-center text-white/50">
          <IconAward size={20} />
        </div>

        {/* Headline */}
        <div className="flex flex-col gap-1">
          <span className="font-sans text-[9px] tracking-[0.28em] uppercase text-white/30">
            O padrão comum
          </span>
          <h3
            className="[font-family:'Playfair_Display',serif] font-bold text-white leading-[1.08] tracking-[-0.01em]"
            style={{ fontSize: "clamp(20px,2.5vw,28px)" }}
          >
            O que os une
          </h3>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/[0.07]" />

        {/* Patterns list */}
        <div className="flex flex-col gap-3">
          {PATTERNS.map((item, pi) => (
            <motion.div
              key={pi}
              initial={{ opacity: 0, x: -8 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
              transition={{ delay: i * 0.07 + pi * 0.1 + 0.5, duration: 0.5, ease: "easeOut" }}
              className="flex items-start gap-3"
            >
              <div className="w-4 h-4 shrink-0 border border-white/[0.1] flex items-center justify-center mt-0.5">
                <span className="text-white/40 text-[7px]">◆</span>
              </div>
              <span className="font-sans text-[11px] tracking-[0.1em] uppercase text-white/50 leading-relaxed">
                {item}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/[0.07]" />

        {/* Quote */}
        <p
          className="[font-family:'Playfair_Display',serif] italic text-white/55 leading-[1.6]"
          style={{ fontSize: "clamp(13px,1.2vw,15px)" }}
        >
          "O conhecimento é o multiplicador de todos os seus outros esforços."
        </p>
      </div>
    </motion.div>
  );
}

// ─── HonorableMentionsSection ─────────────────────────────────────────────────

export function HonorableMentionsSection() {
  return (
    <section
      id="hall"
      className="relative border-t border-white/[0.06] py-24 md:py-36 overflow-hidden bg-black"
    >
      {/* Noise */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Vertical center line */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/[0.05] to-transparent pointer-events-none"
      />

      {/* Giant watermark headline */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
      >
        <span
          className="[font-family:'Playfair_Display',serif] font-black text-white/[0.018] select-none whitespace-nowrap leading-none"
          style={{ fontSize: "clamp(80px,14vw,180px)" }}
        >
          HALL OF FAME
        </span>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-8 md:px-14">

        {/* ── Section header ─────────────────────────────────────────────── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mb-20 md:mb-28"
        >
          <motion.div variants={fadeUp} className="flex flex-col gap-4 max-w-[680px]">
            <span className="font-sans text-[10px] tracking-[0.28em] uppercase text-white/30 border-l-2 border-white/20 pl-3">
              Hall da Fama
            </span>

            {/* Large impactful headline */}
            <h2
              className="[font-family:'Playfair_Display',serif] font-black leading-[1.0] tracking-[-0.03em] text-white"
              style={{ fontSize: "clamp(42px,7vw,96px)" }}
            >
              Mentes que
              <br />
              <em className="not-italic text-white/35">Dominaram</em>
              <br />
              o Jogo.
            </h2>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col sm:flex-row sm:items-end gap-8 sm:gap-16"
          >
            <p
              className="font-sans font-light text-white/45 leading-[1.8] max-w-[460px]"
              style={{ fontSize: "clamp(14px,1.2vw,16px)" }}
            >
              Honramos aqueles que entenderam que o conhecimento, a estratégia e a força mental são os únicos ativos que ninguém pode tirar de você.
            </p>
           
          </motion.div>
        </motion.div>

        {/* ── Card grid ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-white/[0.05]">
          {PEOPLE.map((p, i) => (
            // Wrap in bg-black to make gap-px act as border
            <div key={i} className="bg-black">
              <PersonCard person={p} i={i} />
            </div>
          ))}
          <div className="bg-black">
            <SummaryCard i={PEOPLE.length} />
          </div>
        </div>

        {/* ── Bottom rule ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="mt-16 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent origin-left"
        />
      </div>
    </section>
  );
}