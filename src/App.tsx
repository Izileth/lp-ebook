import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Book {
  id: number;
  title: string;
  category: string;
  price: string;
  pages: string;
  badge: string | null;
}

interface Stat {
  value: string;
  label: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const BOOKS: Book[] = [
  { id: 1, title: "Mentalidade de Alto Desempenho",  category: "Produtividade", price: "R$ 29,90", pages: "187 páginas", badge: "Mais Vendido" },
  { id: 2, title: "Finanças Pessoais na Prática",    category: "Finanças",      price: "R$ 24,90", pages: "142 páginas", badge: "Novo"        },
  { id: 3, title: "Liderança Sem Título",             category: "Liderança",     price: "R$ 34,90", pages: "210 páginas", badge: null          },
  { id: 4, title: "Foco: A Arte de Não se Distrair", category: "Produtividade", price: "R$ 27,90", pages: "165 páginas", badge: "Destaque"    },
];

const STATS: Stat[] = [
  { value: "12+", label: "Títulos"   },
  { value: "4.9", label: "Avaliação" },
  { value: "3k+", label: "Leitores"  },
];

const NAV_LINKS  = ["Ebooks", "Sobre", "Contato"] as const;
const FOOT_LINKS = ["Termos", "Privacidade", "Contato"] as const;

// ─── Motion Variants ──────────────────────────────────────────────────────────

const fadeUpVariants: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
};

const staggerContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const slideIn: Variants = {
  hidden:  { x: "100%" },
  visible: { x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit:    { x: "100%", transition: { duration: 0.35, ease: [0.7, 0, 1, 1] } },
};

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 },
  }),
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function IconBook() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IconStar() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function IconZap() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="3" y1="6"  x2="21" y2="6"  />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ─── BookCard ─────────────────────────────────────────────────────────────────

interface BookCardProps {
  book: Book;
  index: number;
}

function BookCard({ book, index }: BookCardProps) {
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
      onClick={() => alert(`Redirecionando para carrinho: ${book.title}`)}
    >
      {book.badge !== null && (
        <span className="absolute top-5 right-5 bg-white text-black font-sans text-[10px] tracking-[0.15em] uppercase px-2.5 py-0.5 z-10">
          {book.badge}
        </span>
      )}

      {/* Cover */}
      <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.06] mb-6 flex items-center justify-center overflow-hidden">
        <span
          className="[font-family:'Playfair_Display',serif] font-black select-none text-white/10 transition-all duration-500 group-hover:text-white/[0.16] group-hover:scale-110"
          style={{ fontSize: "clamp(40px,6vw,64px)" }}
        >
          F
        </span>
        {/* Subtle category watermark */}
        <span className="absolute bottom-4 left-4 font-sans text-[9px] tracking-[0.2em] uppercase text-white/20">
          {book.category}
        </span>
        <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
      </div>

      <p className="font-sans text-[10px] tracking-[0.18em] uppercase text-white/40 mb-2 flex items-center gap-1.5">
        <span className="text-white/25"><IconBook /></span>
        {book.category}
      </p>
      <h3 className="[font-family:'Playfair_Display',serif] text-[18px] font-bold leading-[1.25] mb-4">
        {book.title}
      </h3>

      <div className="flex items-center justify-between mb-5">
        <span className="font-sans text-[11px] text-white/35 tracking-wide">{book.pages}</span>
        <span className="[font-family:'Playfair_Display',serif] text-lg font-bold">{book.price}</span>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-white text-black font-sans text-[12px] font-medium tracking-[0.1em] uppercase py-3 flex items-center justify-center gap-2 transition-colors duration-200 hover:bg-white/85"
        onClick={(e) => e.stopPropagation()}
      >
        Adquirir
        <IconArrowRight />
      </motion.button>
    </motion.article>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap"
      />

      <div className="bg-black text-white min-h-screen overflow-x-hidden scroll-smooth">

        {/* Noise overlay */}
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* ── Mobile sidebar ──────────────────────────────────────────────── */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key="mobile-menu"
              variants={slideIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navegação"
              className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-center gap-10"
            >
              <button
                aria-label="Fechar menu"
                onClick={() => setMenuOpen(false)}
                className="absolute top-6 right-6 text-white bg-transparent border-none cursor-pointer hover:opacity-60 transition-opacity"
              >
                <IconX />
              </button>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-center gap-8"
              >
                {NAV_LINKS.map((item) => (
                  <motion.a
                    key={item}
                    variants={fadeUpVariants}
                    href="#"
                    onClick={() => setMenuOpen(false)}
                    className="[font-family:'Playfair_Display',serif] text-4xl text-white/60 no-underline hover:text-white transition-colors duration-200"
                  >
                    {item}
                  </motion.a>
                ))}

                <motion.a
                  variants={fadeUpVariants}
                  href="#livros"
                  onClick={() => setMenuOpen(false)}
                  className="mt-4 bg-white text-black font-sans text-[13px] font-medium tracking-[0.1em] uppercase px-8 py-3.5 flex items-center gap-2 hover:bg-white/85 transition-colors"
                >
                  Ver Catálogo <IconArrowRight />
                </motion.a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={[
            "fixed top-0 left-0 right-0 z-[100] h-16 flex items-center justify-between px-10",
            "transition-[background,border-color,backdrop-filter] duration-500",
            scrolled
              ? "border-b border-white/[0.08] bg-black/90 backdrop-blur-xl"
              : "border-b border-transparent",
          ].join(" ")}
        >
          {/* Logo */}
          <div className="flex items-baseline gap-2">
            <span className="[font-family:'Playfair_Display',serif] text-xl font-bold tracking-[0.02em]">
              FOCUS
            </span>
            <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-white/30">
              | Conhecimento
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((item) => (
              <a
                key={item}
                href="#"
                className="font-sans text-[13px] tracking-[0.12em] uppercase text-white/55 no-underline hover:text-white transition-colors duration-200"
              >
                {item}
              </a>
            ))}
            <motion.a
              href="#livros"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-white text-black font-sans text-[12px] font-medium tracking-[0.1em] uppercase px-5 py-2.5 flex items-center gap-2 hover:bg-white/85 transition-colors"
            >
              Explorar <IconArrowRight />
            </motion.a>
          </nav>

          {/* Hamburger */}
          <button
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="md:hidden text-white bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity"
          >
            <IconMenu />
          </button>
        </motion.header>

        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section className="min-h-screen flex items-center px-10 pt-24 pb-20 relative overflow-hidden">
          {/* Vertical accent */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-[15%] h-[70%] w-px bg-gradient-to-b from-transparent via-white/30 to-transparent pointer-events-none"
          />
          {/* Circles */}
          <motion.div
            aria-hidden="true"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
            className="absolute right-[5%] top-1/2 -translate-y-1/2 rounded-full border border-white/[0.05] pointer-events-none"
            style={{ width: "clamp(300px,45vw,600px)", height: "clamp(300px,45vw,600px)" }}
          />
          <motion.div
            aria-hidden="true"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.5 }}
            className="absolute right-[5%] top-1/2 translate-x-[12%] -translate-y-1/2 rounded-full border border-white/[0.03] pointer-events-none"
            style={{ width: "clamp(200px,30vw,400px)", height: "clamp(200px,30vw,400px)" }}
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-[1200px] mx-auto w-full relative"
          >
            {/* Eyebrow */}
            <motion.div variants={fadeUpVariants} className="mb-6">
              <span className="font-sans text-[11px] tracking-[0.25em] uppercase text-white/35 border-l-2 border-white/20 pl-3.5">
                Plataforma de Conhecimento
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUpVariants}
              className="[font-family:'Playfair_Display',serif] font-black leading-[0.92] tracking-[-0.02em] mb-8 max-w-[800px]"
              style={{ fontSize: "clamp(52px,9vw,120px)" }}
            >
              Conhecimento
              <br />
              <em className="not-italic text-white/70">que transforma.</em>
            </motion.h1>

            {/* Body */}
            <motion.p
              variants={fadeUpVariants}
              className="font-sans font-light leading-[1.7] text-white/50 mb-12 max-w-[460px]"
              style={{ fontSize: "clamp(15px,1.5vw,18px)" }}
            >
              Ebooks cuidadosamente selecionados para quem busca evolução real.
              Conteúdo direto, profundo e aplicável.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUpVariants} className="flex gap-4 flex-wrap mb-[72px]">
              <motion.a
                href="#livros"
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white text-black font-sans text-[13px] font-medium tracking-[0.1em] uppercase px-8 py-3.5 flex items-center gap-2 hover:bg-white/85 transition-colors"
              >
                Ver Ebooks <IconArrowRight />
              </motion.a>
              <motion.a
                href="#sobre"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="border border-white/25 text-white font-sans text-[13px] font-light tracking-[0.1em] uppercase px-7 py-3.5 hover:border-white/60 hover:bg-white/[0.04] transition-[border-color,background]"
              >
                Saiba mais
              </motion.a>
            </motion.div>

            {/* Stats */}
            <motion.div variants={staggerContainer} className="flex gap-10 flex-wrap">
              {STATS.map(({ value, label }) => (
                <motion.div key={label} variants={fadeUpVariants} className="border-l border-white/[0.14] pl-6">
                  <p className="[font-family:'Playfair_Display',serif] text-[28px] font-bold">{value}</p>
                  <p className="font-sans text-[12px] tracking-[0.15em] uppercase text-white/30 mt-0.5">{label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Decorative letter */}
          <motion.span
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.8 }}
            className="[font-family:'Playfair_Display',serif] font-black select-none pointer-events-none absolute right-[-10px] bottom-[-20px] text-white/[0.04] leading-[0.85] tracking-[-0.05em]"
            style={{ fontSize: "clamp(140px,22vw,280px)" }}
          >
            F
          </motion.span>
        </section>

        {/* ── Features strip ──────────────────────────────────────────────── */}
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

        {/* ── Books ───────────────────────────────────────────────────────── */}
        <section id="livros" className="px-10 py-[100px] border-b border-white/[0.05]">
          <div className="max-w-[1200px] mx-auto">

            {/* Section header */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="flex justify-between items-end mb-16 flex-wrap gap-6"
            >
              <div>
                <motion.p
                  variants={fadeUpVariants}
                  className="font-sans text-[11px] tracking-[0.25em] uppercase text-white/30 mb-3 flex items-center gap-2"
                >
                  <span className="text-white/20"><IconBook /></span>
                  Catálogo
                </motion.p>
                <motion.h2
                  variants={fadeUpVariants}
                  className="[font-family:'Playfair_Display',serif] font-bold leading-[1.1]"
                  style={{ fontSize: "clamp(32px,5vw,56px)" }}
                >
                  Nossos
                  <br />
                  <em className="not-italic">Títulos</em>
                </motion.h2>
              </div>

              <motion.a
                variants={fadeUpVariants}
                href="#"
                whileHover={{ scale: 1.02 }}
                className="border border-white/25 text-white font-sans text-[13px] tracking-[0.1em] uppercase px-7 py-3.5 flex items-center gap-2 hover:border-white/60 hover:bg-white/[0.04] transition-[border-color,background]"
              >
                Ver todos <IconArrowRight />
              </motion.a>
            </motion.div>

            <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
              {BOOKS.map((book, i) => (
                <BookCard key={book.id} book={book} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <section className="px-10 py-[100px] relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none"
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="max-w-[700px] mx-auto text-center relative"
          >
            <motion.p
              variants={fadeUpVariants}
              className="font-sans text-[11px] tracking-[0.25em] uppercase text-white/30 mb-5"
            >
              Comece Hoje
            </motion.p>

            <motion.h2
              variants={fadeUpVariants}
              className="[font-family:'Playfair_Display',serif] font-black leading-[1] tracking-[-0.02em] mb-6"
              style={{ fontSize: "clamp(36px,6vw,64px)" }}
            >
              Investir em conhecimento
              <br />
              <em className="not-italic text-white/70">é o melhor retorno.</em>
            </motion.h2>

            <motion.p
              variants={fadeUpVariants}
              className="font-sans font-light text-base leading-[1.7] text-white/45 mb-12"
            >
              Cada ebook é entregue diretamente no seu e-mail após a compra.
              Pagamento simples e seguro via Kiwifi.
            </motion.p>

            {/* Trust badges */}
            <motion.div
              variants={fadeUpVariants}
              className="flex justify-center gap-6 mb-10 flex-wrap"
            >
              {[
                { icon: <IconShield />, label: "Pagamento seguro"  },
                { icon: <IconMail />,   label: "Entrega imediata"  },
                { icon: <IconZap />,    label: "Acesso vitalício"  },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-white/35 font-sans text-[11px] tracking-wide">
                  <span>{icon}</span>
                  {label}
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeUpVariants} className="flex gap-4 justify-center flex-wrap">
              <motion.a
                href="#livros"
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white text-black font-sans text-[13px] font-medium tracking-[0.1em] uppercase px-8 py-3.5 flex items-center gap-2 hover:bg-white/85 transition-colors"
              >
                Explorar catálogo <IconArrowRight />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.02 }}
                className="border border-white/25 text-white font-sans text-[13px] tracking-[0.1em] uppercase px-7 py-3.5 hover:border-white/60 hover:bg-white/[0.04] transition-[border-color,background]"
              >
                Falar com suporte
              </motion.a>
            </motion.div>
          </motion.div>
        </section>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <footer className="px-10 py-12 border-t border-white/[0.05]">
          <div className="max-w-[1200px] mx-auto flex justify-between items-center flex-wrap gap-6">
            <div className="flex items-baseline gap-2">
              <span className="[font-family:'Playfair_Display',serif] text-[18px] font-bold">FOCUS</span>
              <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-white/25">| Conhecimento</span>
            </div>

            <p className="font-sans text-[11px] text-white/25 tracking-wide">
              © 2025 Focus Conhecimento. Todos os direitos reservados.
            </p>

            <nav className="flex gap-7">
              {FOOT_LINKS.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="font-sans text-[11px] tracking-[0.1em] uppercase text-white/30 no-underline hover:text-white transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}