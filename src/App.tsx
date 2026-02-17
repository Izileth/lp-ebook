import { useState, useEffect, useRef } from "react";
import type { RefObject } from "react";

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

interface UseInViewReturn {
  ref: RefObject<HTMLDivElement | null>;
  inView: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const BOOKS: Book[] = [
  { id: 1, title: "Mentalidade de Alto Desempenho", category: "Produtividade", price: "R$ 29,90", pages: "187 páginas", badge: "Mais Vendido" },
  { id: 2, title: "Finanças Pessoais na Prática", category: "Finanças", price: "R$ 24,90", pages: "142 páginas", badge: "Novo" },
  { id: 3, title: "Liderança Sem Título", category: "Liderança", price: "R$ 34,90", pages: "210 páginas", badge: null },
  { id: 4, title: "Foco: A Arte de Não se Distrair", category: "Produtividade", price: "R$ 27,90", pages: "165 páginas", badge: "Destaque" },
];

const STATS: Stat[] = [
  { value: "12+", label: "Títulos" },
  { value: "4.9", label: "Avaliação" },
  { value: "3k+", label: "Leitores" },
];

const NAV_LINKS = ["Ebooks", "Sobre", "Contato"] as const;
const FOOT_LINKS = ["Termos", "Privacidade", "Contato"] as const;

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useInView(threshold = 0.15): UseInViewReturn {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState<boolean>(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

type DelaySlot = 1 | 2 | 3 | 4;

const DELAY_CLASSES: Record<DelaySlot, string> = {
  1: "[transition-delay:100ms]",
  2: "[transition-delay:220ms]",
  3: "[transition-delay:340ms]",
  4: "[transition-delay:460ms]",
};

function fadeUp(inView: boolean, delay: DelaySlot | 0 = 0): string {
  const base = "transition-[opacity,transform] duration-700 ease-[cubic-bezier(.16,1,.3,1)]";
  const hidden = "opacity-0 translate-y-8";
  const visible = "opacity-100 translate-y-0";
  const d = delay > 0 ? DELAY_CLASSES[delay as DelaySlot] : "";
  return [base, d, inView ? visible : hidden].filter(Boolean).join(" ");
}

// ─── BookCard ─────────────────────────────────────────────────────────────────

interface BookCardProps {
  book: Book;
  inView: boolean;
  index: number;
}

function BookCard({ book, inView, index }: BookCardProps) {
  const delay = (Math.min(index + 1, 4)) as DelaySlot;

  return (
    <article
      className={[
        fadeUp(inView, delay),
        "relative border border-white/[0.08] bg-[#0a0a0a] p-8 cursor-pointer",
        "transition-[border-color,transform] duration-300",
        "hover:border-white/30 hover:-translate-y-1",
      ].join(" ")}
      onClick={() => alert(`Redirecionando para carrinho: ${book.title}`)}
    >
      {book.badge !== null && (
        <span className="absolute top-5 right-5 bg-white text-black text-[10px] tracking-[0.15em] uppercase px-2.5 py-0.5 font-sans">
          {book.badge}
        </span>
      )}

      {/* Cover placeholder */}
      <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.06] mb-6 flex items-center justify-center overflow-hidden">
        <span className="[font-family:'Playfair_Display',serif] text-5xl font-black opacity-10 select-none">F</span>
        <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
      </div>

      <p className="font-sans text-[10px] tracking-[0.18em] uppercase text-white/40 mb-2">
        {book.category}
      </p>
      <h3 className="[font-family:'Playfair_Display',serif] text-[19px] font-bold leading-[1.25] mb-4">
        {book.title}
      </h3>

      <div className="flex items-center justify-between">
        <span className="font-sans text-[11px] text-white/40 tracking-wide">{book.pages}</span>
        <span className="[font-family:'Playfair_Display',serif] text-lg font-bold">{book.price}</span>
      </div>

      <button
        className="mt-5 w-full bg-white text-black font-sans text-[13px] font-medium tracking-[0.1em] uppercase py-3 transition-colors duration-200 hover:bg-white/85"
        onClick={(e) => e.stopPropagation()}
      >
        Adquirir
      </button>
    </article>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  const hero = useInView(0.1);
  const books = useInView(0.1);
  const cta = useInView(0.1);

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

      <div className="bg-black text-white min-h-screen overflow-x-hidden [font-family:'Georgia',serif] scroll-smooth">

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
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
          className={[
            "fixed inset-0 bg-black z-[200]",
            "flex flex-col items-center justify-center gap-10",
            "transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)]",
            menuOpen ? "translate-x-0" : "translate-x-full",
          ].join(" ")}
        >
          <button
            aria-label="Fechar menu"
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 text-white text-2xl bg-transparent border-none cursor-pointer leading-none hover:opacity-60 transition-opacity"
          >
            ✕
          </button>

          {NAV_LINKS.map((item) => (
            <a
              key={item}
              href="#"
              onClick={() => setMenuOpen(false)}
              className="[font-family:'Playfair_Display',serif] text-4xl text-white/60 no-underline hover:text-white transition-colors duration-200"
            >
              {item}
            </a>
          ))}

          <a
            href="#livros"
            onClick={() => setMenuOpen(false)}
            className="mt-5 bg-white text-black font-sans text-[13px] font-medium tracking-[0.1em] uppercase px-8 py-3.5 hover:bg-white/85 transition-colors"
          >
            Ver Catálogo
          </a>
        </div>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <header
          className={[
            "fixed top-0 left-0 right-0 z-[100] h-16 flex items-center justify-between px-10",
            "transition-all duration-500",
            scrolled
              ? "border-b border-white/[0.08] bg-black/[0.92] backdrop-blur-xl"
              : "border-b border-transparent",
          ].join(" ")}
        >
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
                className="font-sans text-[13px] tracking-[0.12em] uppercase text-white/60 no-underline hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
            <a
              href="#livros"
              className="bg-white text-black font-sans text-[12px] font-medium tracking-[0.1em] uppercase px-5 py-2.5 hover:bg-white/85 transition-colors"
            >
              Explorar
            </a>
          </nav>

          {/* Hamburger */}
          <button
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="md:hidden flex flex-col gap-1.5 bg-transparent border-none cursor-pointer p-1"
          >
            {([0, 1, 2] as const).map((i) => (
              <span key={i} className="block w-6 h-px bg-white" />
            ))}
          </button>
        </header>

        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section className="min-h-screen flex items-center px-10 pt-24 pb-20 relative overflow-hidden">
          {/* Vertical accent line */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-[20%] h-[60%] w-px bg-gradient-to-b from-transparent via-white/40 to-transparent pointer-events-none"
          />
          {/* Circles */}
          <div aria-hidden="true" className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[clamp(300px,45vw,600px)] h-[clamp(300px,45vw,600px)] rounded-full border border-white/[0.05] pointer-events-none" />
          <div aria-hidden="true" className="absolute right-[5%] top-1/2 translate-x-[10%] -translate-y-1/2 w-[clamp(200px,30vw,400px)] h-[clamp(200px,30vw,400px)] rounded-full border border-white/[0.03] pointer-events-none" />

          <div ref={hero.ref} className="max-w-[1200px] mx-auto w-full relative">
            {/* Eyebrow */}
            <div className={fadeUp(hero.inView, 1)}>
              <span className="font-sans text-[11px] tracking-[0.25em] uppercase text-white/35 border-l-2 border-white/20 pl-3.5">
                Plataforma de Conhecimento
              </span>
            </div>

            {/* Headline */}
            <h1
              className={[
                fadeUp(hero.inView, 2),
                "[font-family:'Playfair_Display',serif] font-black leading-[0.92] tracking-[-0.02em] mt-6 mb-8 max-w-[800px]",
                "text-[clamp(52px,9vw,120px)]",
              ].join(" ")}
            >
              Conhecimento
              <br />
              <em className="not-italic text-white/75">que transforma.</em>
            </h1>

            {/* Body copy */}
            <p
              className={[
                fadeUp(hero.inView, 3),
                "font-sans font-light leading-[1.7] text-white/50 mb-12 max-w-[460px]",
                "text-[clamp(15px,1.5vw,18px)]",
              ].join(" ")}
            >
              Ebooks cuidadosamente selecionados para quem busca evolução real.
              Conteúdo direto, profundo e aplicável.
            </p>

            {/* CTAs */}
            <div className={[fadeUp(hero.inView, 4), "flex gap-4 flex-wrap"].join(" ")}>
              <a
                href="#livros"
                className="bg-white text-black font-sans text-[13px] font-medium tracking-[0.1em] uppercase px-8 py-3.5 hover:bg-white/85 transition-[background,transform] duration-200 hover:-translate-y-px"
              >
                Ver Ebooks
              </a>
              <a
                href="#sobre"
                className="border border-white/25 text-white font-sans text-[13px] font-light tracking-[0.1em] uppercase px-7 py-3.5 hover:border-white hover:bg-white/[0.04] transition-[border-color,background,transform] duration-200 hover:-translate-y-px"
              >
                Saiba mais
              </a>
            </div>

            {/* Stats */}
            <div className={[fadeUp(hero.inView, 4), "flex gap-10 mt-[72px] flex-wrap"].join(" ")}>
              {STATS.map(({ value, label }) => (
                <div key={label} className="border-l border-white/[0.14] pl-6">
                  <p className="[font-family:'Playfair_Display',serif] text-[28px] font-bold">{value}</p>
                  <p className="font-sans text-[12px] tracking-[0.15em] uppercase text-white/30 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative letter */}
          <span
            aria-hidden="true"
            className="[font-family:'Playfair_Display',serif] font-black select-none pointer-events-none absolute right-[-10px] bottom-[-20px] text-white/[0.04] leading-[0.85] tracking-[-0.05em] text-[clamp(140px,22vw,280px)]"
          >
            F
          </span>
        </section>

        {/* ── Books ───────────────────────────────────────────────────────── */}
        <section id="livros" className="px-10 py-[100px] border-t border-white/[0.05]">
          <div ref={books.ref} className="max-w-[1200px] mx-auto">
            <div className="flex justify-between items-end mb-16 flex-wrap gap-6">
              <div>
                <p className={[fadeUp(books.inView, 0), "font-sans text-[11px] tracking-[0.25em] uppercase text-white/30 mb-3"].join(" ")}>
                  Catálogo
                </p>
                <h2
                  className={[
                    fadeUp(books.inView, 1),
                    "[font-family:'Playfair_Display',serif] font-bold leading-[1.1]",
                    "text-[clamp(32px,5vw,56px)]",
                  ].join(" ")}
                >
                  Nossos<br />
                  <em className="not-italic">Títulos</em>
                </h2>
              </div>

              <a
                href="#"
                className={[
                  fadeUp(books.inView, 2),
                  "border border-white/25 text-white font-sans text-[13px] tracking-[0.1em] uppercase px-7 py-3.5 hover:border-white hover:bg-white/[0.04] transition-[border-color,background]",
                ].join(" ")}
              >
                Ver todos
              </a>
            </div>

            <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
              {BOOKS.map((book, i) => (
                <BookCard key={book.id} book={book} inView={books.inView} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <section className="px-10 py-[100px] border-t border-white/[0.05] relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none"
          />

          <div ref={cta.ref} className="max-w-[700px] mx-auto text-center relative">
            <p className={[fadeUp(cta.inView, 0), "font-sans text-[11px] tracking-[0.25em] uppercase text-white/30 mb-5"].join(" ")}>
              Comece Hoje
            </p>

            <h2
              className={[
                fadeUp(cta.inView, 1),
                "[font-family:'Playfair_Display',serif] font-black leading-[1] tracking-[-0.02em] mb-6",
                "text-[clamp(36px,6vw,64px)]",
              ].join(" ")}
            >
              Investir em conhecimento
              <br />
              <em className="not-italic text-white/75">é o melhor retorno.</em>
            </h2>

            <p className={[fadeUp(cta.inView, 2), "font-sans font-light text-base leading-[1.7] text-white/45 mb-12"].join(" ")}>
              Cada ebook é entregue diretamente no seu e-mail após a compra.
              Pagamento simples e seguro via Kiwifi.
            </p>

            <div className={[fadeUp(cta.inView, 3), "flex gap-4 justify-center flex-wrap"].join(" ")}>
              <a
                href="#livros"
                className="bg-white text-black font-sans text-[13px] font-medium tracking-[0.1em] uppercase px-8 py-3.5 hover:bg-white/85 transition-colors"
              >
                Explorar catálogo
              </a>
              <a
                href="#"
                className="border border-white/25 text-white font-sans text-[13px] tracking-[0.1em] uppercase px-7 py-3.5 hover:border-white hover:bg-white/[0.04] transition-[border-color,background]"
              >
                Falar com suporte
              </a>
            </div>
          </div>
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
                  className="font-sans text-[11px] tracking-[0.1em] uppercase text-white/30 no-underline hover:text-white transition-colors"
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