import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useProduct } from "../hooks/useProduct"; // Import the new hook
import { IconArrowLeft, IconArrowRight, IconBook, IconShield, IconMail, IconStar } from "../components/Icons";
import { Header } from "../components/Header";
import { MobileMenu } from "../components/MobileMenu";
import { NoiseOverlay } from "../components/NoiseOverlay";
import { IconShare } from "../components/Icons";
// ─── Motion Variants ──────────────────────────────────────────────────────────

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1], delay },
  }),
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, x: -20 },
  visible: {
    opacity: 1, scale: 1, x: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
  },
};

// ─── Not Found ────────────────────────────────────────────────────────────────

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white gap-6">
      <span
        className="font-black text-white/[0.04] select-none pointer-events-none"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(100px,18vw,220px)",
          lineHeight: 1,
        }}
      >
        404
      </span>
      <div className="text-center -mt-8">
        <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-white/35 mb-3">
          Página não encontrada
        </p>
        <h2
          className="font-bold mb-8"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px,3vw,36px)" }}
        >
          Ebook não encontrado
        </h2>
        <Link
          to="/"
          className="inline-flex items-center gap-2 border border-white/20 text-white font-sans text-[12px] tracking-[0.12em] uppercase px-6 py-3 hover:border-white/50 hover:bg-white/[0.04] transition-[border-color,background]"
        >
          <IconArrowLeft />
          Voltar para a loja
        </Link>
      </div>
    </div>
  );
}

// ─── Stat Item ────────────────────────────────────────────────────────────────

interface StatItemProps {
  label: string;
  value: string;
}

function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="flex flex-col items-center gap-1 px-6">
      <span
        className="font-sans text-[10px] tracking-[0.18em] uppercase text-white/35"
      >
        {label}
      </span>
      <span
        className="font-bold text-white"
        style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(17px,2vw,22px)" }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Trust Badge ──────────────────────────────────────────────────────────────

interface TrustBadgeProps {
  icon: React.ReactNode;
  label: string;
}

function TrustBadge({ icon, label }: TrustBadgeProps) {
  return (
    <div className="flex items-center gap-2 text-white/35 font-sans text-[11px] tracking-wide">
      <span className="text-white/25">{icon}</span>
      {label}
    </div>
  );
}

// ─── BookPage ─────────────────────────────────────────────────────────────────

export function BookPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const { product: book, loading, error } = useProduct(bookId); // Use the new hook
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) return <div>Loading book details...</div>;
  if (error) return <div>Error loading book: {error}</div>;
  if (!book) return <NotFound />;

  // Extract imageUrl from product_images, use first one if available
  const imageUrl = book.product_images?.[0]?.image_url;

  // Format price for display
  const hasDiscount = book.discount_price && book.discount_price > 0 && book.discount_price < book.price;
  const formattedPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(book.price);
  const formattedDiscountPrice = book.discount_price 
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(book.discount_price)
    : null;

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500&display=swap"
      />

      <div
        className="bg-black min-h-screen text-white overflow-x-hidden pt-16"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        <NoiseOverlay />
        <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        {/* Decorative vertical line */}
        <div
          aria-hidden="true"
          className="fixed left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/[0.06] to-transparent pointer-events-none"
        />

        {/* ── Main ────────────────────────────────────────────────────────── */}
        <main className="max-w-[1200px] mx-auto px-8 md:px-16 py-16 md:py-24">
          <div className="mb-12 flex items-center justify-between">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 font-sans text-[12px] tracking-[0.12em] uppercase text-white/45 hover:text-white transition-colors duration-200"
            >
              <span className="transition-transform duration-200 group-hover:-translate-x-1">
                <IconArrowLeft />
              </span>
              Voltar para a loja
            </Link>

            {book.share_url && (
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: book.name,
                      text: book.description,
                      url: book.share_url
                    });
                  } else {
                    navigator.clipboard.writeText(book.share_url || "");
                    alert("Link de compartilhamento copiado!");
                  }
                }}
                className="inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.12em] uppercase text-white/45 hover:text-white transition-colors duration-200"
              >
                <IconShare size={14} />
                Compartilhar
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">

            {/* ── Cover ─────────────────────────────────────────────────── */}
            <motion.div
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              className="relative"
            >
              {/* Badge */}
              {book.badge && (
                <motion.span
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="absolute -top-3 -right-3 z-10 bg-white text-black font-sans text-[10px] font-medium tracking-[0.15em] uppercase px-3 py-1"
                >
                  {book.badge}
                </motion.span>
              )}

              {/* Image frame */}
              <div className="relative aspect-[3/4] w-full max-w-sm mx-auto border border-white/[0.08] overflow-hidden">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={book.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  /* Placeholder when no image */
                  <div className="w-full h-full bg-gradient-to-br from-white/[0.06] to-white/[0.02] flex flex-col items-center justify-center gap-3">
                    <span
                      className="font-black text-white/10 select-none"
                      style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(80px,12vw,120px)" }}
                    >
                      F
                    </span>
                    <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/20">
                      {book.category}
                    </span>
                  </div>
                )}

                {/* Subtle bottom gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              </div>

              {/* Decorative ring behind cover */}
              <div
                aria-hidden="true"
                className="absolute -bottom-6 -right-6 w-48 h-48 rounded-full border border-white/[0.04] pointer-events-none -z-10"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-12 -right-12 w-72 h-72 rounded-full border border-white/[0.02] pointer-events-none -z-10"
              />
            </motion.div>

            {/* ── Details ───────────────────────────────────────────────── */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="flex flex-col"
            >
              {/* Eyebrow */}
              <motion.div variants={fadeUpVariants} custom={0} className="mb-4">
                <span className="font-sans text-[11px] tracking-[0.25em] uppercase text-white/35 border-l-2 border-white/20 pl-3.5">
                  {book.category}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                variants={fadeUpVariants}
                custom={0.05}
                className="font-bold leading-[1.05] tracking-[-0.02em] mb-5"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(32px,4.5vw,58px)",
                }}
              >
                {book.name}
              </motion.h1>

              {/* Star rating */}
              <motion.div
                variants={fadeUpVariants}
                custom={0.1}
                className="flex items-center gap-2 mb-6"
              >
                <div className="flex gap-0.5 text-white/70">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <IconStar key={i} className={i < Math.floor(book.rating) ? "text-white/70" : "text-white/20"} />
                  ))}
                </div>
                <span className="font-sans text-[11px] text-white/35 tracking-wide">
                  {book.rating} · Verificado
                </span>
              </motion.div>

              {/* Description */}
              <motion.p
                variants={fadeUpVariants}
                custom={0.15}
                className="font-sans font-light leading-[1.75] text-white/55 mb-8"
                style={{ fontSize: "clamp(14px,1.2vw,16px)" }}
              >
                {book.description ??
                  "Um guia prático e direto ao ponto para quem busca evolução real. Conteúdo baseado em evidências, linguagem acessível e resultados aplicáveis desde a primeira leitura."}
              </motion.p>

              {/* Stats bar */}
              <motion.div
                variants={fadeUpVariants}
                custom={0.2}
                className="flex items-stretch divide-x divide-white/[0.08] border border-white/[0.08] mb-8"
              >
                <StatItem label="Páginas" value={book.pages ?? "–"} />
                <StatItem label="Idioma" value={book.language} />
                <StatItem label="Formato" value="Digital" />
                <StatItem label="Entrega" value="Imediata" />
              </motion.div>

              {/* Price + CTA */}
              <motion.div
                variants={fadeUpVariants}
                custom={0.25}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8"
              >
                <div className="flex flex-col">
                  {hasDiscount && (
                    <span className="font-sans text-[14px] text-white/30 line-through mb-1">
                      {formattedPrice}
                    </span>
                  )}
                  <span
                    className="font-bold text-white"
                    style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px,3.5vw,44px)" }}
                  >
                    {hasDiscount ? formattedDiscountPrice : formattedPrice}
                  </span>
                </div>

                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <motion.a
                    href={book.checkout_url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full sm:w-auto bg-white text-black font-sans text-[13px] font-medium tracking-[0.1em] uppercase py-4 px-8 flex items-center justify-center gap-2 hover:bg-white/85 transition-colors duration-200"
                  >
                    Adquirir Agora
                    <IconArrowRight />
                  </motion.a>
                  
                  {book.access_url && (
                    <Link
                      to={book.access_url}
                      className="font-sans text-[11px] tracking-[0.1em] uppercase text-white/40 hover:text-white transition-colors text-center"
                    >
                      Já possui? Acessar agora
                    </Link>
                  )}
                </div>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                variants={fadeUpVariants}
                custom={0.3}
                className="flex flex-wrap gap-5 pt-6 border-t border-white/[0.06]"
              >
                <TrustBadge icon={<IconShield />} label="Pagamento seguro" />
                <TrustBadge icon={<IconMail />} label="Enviado por e-mail" />
                <TrustBadge icon={<IconBook />} label="Acesso vitalício" />
                <TrustBadge icon={<IconStar />} label="Satisfação garantida" />
              </motion.div>
            </motion.div>
          </div>
        </main>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
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
      </div>
    </>
  );
}