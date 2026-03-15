/* eslint-disable react-hooks/preserve-manual-memoization */
// src/pages/VideoPromotionPage.tsx
import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IconArrowRight, IconLoader } from "../components/Icons";
import type { Variants } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LocationState {
  videoUrl: string;
  checkoutUrl: string;
  bookName: string;
}

type VideoKind = "youtube" | "vimeo" | "direct";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function detectKind(url: string): VideoKind {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("vimeo.com")) return "vimeo";
  return "direct";
}

function buildEmbedUrl(url: string, kind: VideoKind): string {
  if (kind === "youtube") {
    const id = url.split("v=")[1]?.split("&")[0] ?? url.split("/").pop() ?? "";
    return `https://www.youtube.com/embed/${id}?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0`;
  }
  if (kind === "vimeo") {
    const id = url.split("/").pop() ?? "";
    return `https://player.vimeo.com/video/${id}?autoplay=1&background=1&byline=0&title=0`;
  }
  return url;
}

// ─── Inline SVG Icons (mute/unmute — not in shared Icons.tsx) ─────────────────

function IconVolume({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

function IconVolumeOff({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

function IconInstagram({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}


function IconTiktok({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V2a5 5 0 0 0 5 5" />
    </svg>
  );
}

// ─── Motion Variants ──────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (d: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: d },
  }),
};

const fadeIn: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

// ─── VideoPromotionPage ───────────────────────────────────────────────────────

export function VideoPromotionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [canSkip, setCanSkip] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(10);

  const state = location.state as LocationState | undefined;
  const { videoUrl, checkoutUrl, bookName } = state ?? {};

  const kind = videoUrl ? detectKind(videoUrl) : "direct";
  const isEmbed = kind === "youtube" || kind === "vimeo";

  // ── Guard ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!videoUrl || !checkoutUrl) navigate("/");
  }, [videoUrl, checkoutUrl, navigate]);

  // ── Countdown for redirect ────────────────────────────────────────────────
  useEffect(() => {
    if (countdown <= 0) {
      if (checkoutUrl) window.location.href = checkoutUrl;
      return;
    }
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown, checkoutUrl]);

  // ── Show skip button after 5 s ────────────────────────────────────────────
  useEffect(() => {
    const id = setTimeout(() => setCanSkip(true), 5_000);
    return () => clearTimeout(id);
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleVideoEnd = useCallback(() => {
    if (checkoutUrl) window.location.href = checkoutUrl;
  }, [checkoutUrl]);

  const handleSkip = useCallback(() => {
    if (checkoutUrl) window.location.href = checkoutUrl;
  }, [checkoutUrl]);

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress((v.currentTime / v.duration) * 100);
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  }, []);

  if (!videoUrl) return null;

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center overflow-hidden">

      {/* ── Background decoration ──────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,255,255,0.04)_0%,transparent_70%)] pointer-events-none"
      />

      {/* ── Progress bar (top) ─────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 h-px bg-white/[0.08] z-50">
        <motion.div
          className="h-full bg-white origin-left"
          style={{ width: `${progress}%` }}
          transition={{ ease: "linear", duration: 0 }}
        />
      </div>

      {/* ── Header ────────────────────────────────────────────────────── */}
      <motion.header
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 md:px-14 py-6"
      >
        {/* Logo */}
        <div className="flex items-baseline gap-2">
          <span
            className="[font-family:'Playfair_Display',serif] font-bold tracking-[0.02em] text-white"
            style={{ fontSize: 17 }}
          >
            FOCUS
          </span>
          <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/25">
            | Conhecimento
          </span>
        </div>

        {/* Book name */}
        {bookName && (
          <div className="hidden sm:flex flex-col items-end gap-0.5">
            <span className="font-sans text-[9px] tracking-[0.28em] uppercase text-white/30">
              Apresentação especial
            </span>
            <span
              className="[font-family:'Playfair_Display',serif] font-bold text-white/70"
              style={{ fontSize: 13 }}
            >
              {bookName}
            </span>
          </div>
        )}
      </motion.header>

      {/* ── Video container ────────────────────────────────────────────── */}
      <motion.div
        custom={0.15}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-[1100px] px-4 md:px-10"
      >
        {/* Aspect ratio wrapper */}
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <AnimatePresence mode="wait">

            {/* Embed (YouTube / Vimeo) */}
            {isEmbed && (
              <motion.div
                key="embed"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className="absolute inset-0 border border-white/[0.08] overflow-hidden bg-black"
              >
                <iframe
                  src={buildEmbedUrl(videoUrl, kind)}
                  className="w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={bookName ?? "Apresentação"}
                />
                {/* Inert overlay to prevent interaction with embed UI */}
                <div className="absolute inset-0 pointer-events-none" />
              </motion.div>
            )}

            {/* Direct MP4 */}
            {!isEmbed && (
              <motion.video
                key="direct"
                ref={videoRef}
                src={videoUrl}
                autoPlay
                muted={isMuted}
                playsInline
                onEnded={handleVideoEnd}
                onTimeUpdate={handleTimeUpdate}
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className="absolute inset-0 w-full h-full object-contain bg-black border border-white/[0.08]"
              />
            )}
          </AnimatePresence>

          {/* Decorative corner marks */}
          {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos, i) => (
            <div
              key={i}
              aria-hidden="true"
              className={`absolute ${pos} w-3 h-3 pointer-events-none z-20`}
              style={{
                borderTop: i < 2 ? "1px solid rgba(255,255,255,0.18)" : undefined,
                borderBottom: i >= 2 ? "1px solid rgba(255,255,255,0.18)" : undefined,
                borderLeft: i % 2 === 0 ? "1px solid rgba(255,255,255,0.18)" : undefined,
                borderRight: i % 2 === 1 ? "1px solid rgba(255,255,255,0.18)" : undefined,
              }}
            />
          ))}
        </div>

        {/* Mute toggle — direct video only */}
        {!isEmbed && (
          <motion.button
            type="button"
            onClick={toggleMute}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            aria-label={isMuted ? "Ativar som" : "Silenciar"}
            className="absolute bottom-4 right-4 md:bottom-5 md:right-5 z-30 w-10 h-10 border border-white/[0.14] bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-[color,border-color] duration-200"
          >
            {isMuted ? <IconVolumeOff size={16} /> : <IconVolume size={16} />}
          </motion.button>
        )}
      </motion.div>

      {/* ── Footer actions ─────────────────────────────────────────────── */}
      <motion.div
        custom={0.3}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center gap-5 mt-8 pb-8 px-4"
      >
        {/* Status hint */}
        <div className="flex items-center gap-2.5 border border-white/[0.07] px-5 py-2.5">
          <IconLoader size={11} className="text-white/30 animate-spin" />
          <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/30">
            Redirecionando para o checkout em {countdown}s
          </span>
        </div>

        {/* Skip link */}
        <AnimatePresence>
          {canSkip && (
            <motion.button
              type="button"
              onClick={handleSkip}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="group flex items-center gap-2 font-sans text-[11px] tracking-[0.18em] uppercase text-white/25 hover:text-white/60 transition-colors duration-200"
            >
              Pular apresentação
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                <IconArrowRight size={12} />
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Social links ───────────────────────────────────────────────── */}
      <motion.div
        custom={0.4}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center gap-6 mt-12 pb-16 px-4"
      >
        <div className="h-px w-12 bg-white/10" />

        <div className="flex items-center gap-6">
          <a
            href="https://www.instagram.com/modus_focus_?igsh=emxvb2p0Znd6czg0&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 border border-white/[0.12] bg-white/[0.03] flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 hover:bg-white/[0.08] transition-all duration-300"
            aria-label="Instagram"
          >
            <IconInstagram size={18} />
          </a>
          <a
            href="https://www.instagram.com/focus_billionaiire?igsh=Z2hlMjZxZ3RkNmht&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 border border-white/[0.12] bg-white/[0.03] flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 hover:bg-white/[0.08] transition-all duration-300"
            aria-label="Instagram"
          >
            <IconInstagram size={18} />
          </a>
          <a
            href="https://www.tiktok.com/@potencial_marco_zero?_r=1&_t=ZS-94iKpk7Kjlg"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 border border-white/[0.12] bg-white/[0.03] flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 hover:bg-white/[0.08] transition-all duration-300"
            aria-label="TikTok"
          >
            <IconTiktok size={18} />
          </a>
          <a
            href="https://www.tiktok.com/@motivational_unstoppable?_r=1&_t=ZS-94iKngvsDGS"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 border border-white/[0.12] bg-white/[0.03] flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 hover:bg-white/[0.08] transition-all duration-300"
            aria-label="TikTok"
          >
            <IconTiktok size={18} />
          </a>
        </div>

        <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/20">
          Acompanhe a Focus Conhecimento
        </p>
      </motion.div>

    </div>
  );
}