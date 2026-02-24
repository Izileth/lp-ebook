// src/components/StateScreens.tsx
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { IconAlertCircle, IconArrowRight, IconLoader } from "../Icons";

// ─── Shared Variants ──────────────────────────────────────────────────────────

const stagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

// ─── Shared Background Decoration ────────────────────────────────────────────

function SceneDecor() {
    return (
        <>
            {/* Noise */}
            <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                }}
            />
            {/* Vertical line */}
            <div
                aria-hidden="true"
                className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/[0.06] to-transparent pointer-events-none"
            />
            {/* Radial glow */}
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(255,255,255,0.04)_0%,transparent_70%)] pointer-events-none"
            />
        </>
    );
}

// ─── Loading State ────────────────────────────────────────────────────────────

interface LoadingStateProps {
    /** Custom message shown below the spinner label */
    message?: string;
}

export function LoadingState({ message = "Carregando livros..." }: LoadingStateProps) {
    return (
        <div className="relative flex items-center justify-center min-h-[420px] w-full overflow-hidden">
            <SceneDecor />

            <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="relative z-10 flex flex-col items-center gap-6 text-center px-8"
            >
                {/* Animated rings */}
                <motion.div
                    variants={fadeUp}
                    className="relative flex items-center justify-center"
                >
                    {/* Outer ring pulse */}
                    <motion.span
                        animate={{ scale: [1, 1.35, 1], opacity: [0.06, 0, 0.06] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-20 h-20 rounded-full border border-white/30"
                    />
                    {/* Mid ring pulse */}
                    <motion.span
                        animate={{ scale: [1, 1.18, 1], opacity: [0.1, 0, 0.1] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                        className="absolute w-14 h-14 rounded-full border border-white/20"
                    />
                    {/* Icon container */}
                    <div className="relative w-12 h-12 border border-white/[0.14] flex items-center justify-center text-white/60">
                        <IconLoader size={20} strokeWidth={1.5} />
                    </div>
                </motion.div>

                {/* Label */}
                <motion.div variants={fadeUp} className="flex flex-col items-center gap-2">
                    <p
                        className="[font-family:'Playfair_Display',serif] font-bold text-white"
                        style={{ fontSize: "clamp(18px,2vw,24px)" }}
                    >
                        {message}
                    </p>
                    <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-white/30">
                        Aguarde um momento
                    </p>
                </motion.div>

                {/* Progress dots */}
                <motion.div variants={fadeUp} className="flex items-center gap-2">
                    {[0, 1, 2].map((i) => (
                        <motion.span
                            key={i}
                            animate={{ opacity: [0.15, 0.7, 0.15] }}
                            transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.22,
                            }}
                            className="block w-1 h-1 rounded-full bg-white"
                        />
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
}

// ─── Error State ──────────────────────────────────────────────────────────────

interface ErrorStateProps {
    /** The error message to display */
    error: string;
    /** Optional retry callback */
    onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
    return (
        <div className="relative flex items-center justify-center min-h-[420px] w-full overflow-hidden">
            <SceneDecor />

            {/* Large decorative text */}
            <span
                aria-hidden="true"
                className="[font-family:'Playfair_Display',serif] absolute font-black select-none pointer-events-none text-white/[0.03] leading-none"
                style={{ fontSize: "clamp(120px,20vw,240px)" }}
            >
                !
            </span>

            <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="relative z-10 flex flex-col items-center gap-6 text-center px-8 max-w-[480px]"
            >
                {/* Icon */}
                <motion.div variants={fadeUp}>
                    <div className="w-12 h-12 border border-white/[0.14] flex items-center justify-center text-white/50">
                        <IconAlertCircle size={20} strokeWidth={1.5} />
                    </div>
                </motion.div>

                {/* Eyebrow */}
                <motion.div variants={fadeUp} className="flex flex-col items-center gap-2 -mt-2">
                    <span className="font-sans text-[10px] tracking-[0.28em] uppercase text-white/30 border-l-2 border-white/20 pl-3">
                        Algo deu errado
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.h3
                    variants={fadeUp}
                    className="[font-family:'Playfair_Display',serif] font-bold leading-[1.1] tracking-[-0.02em] text-white -mt-2"
                    style={{ fontSize: "clamp(22px,3vw,34px)" }}
                >
                    Não foi possível
                    <br />
                    <em className="not-italic text-white/60">carregar o conteúdo.</em>
                </motion.h3>

                {/* Error detail */}
                <motion.div
                    variants={fadeUp}
                    className="border border-white/[0.08] px-4 py-3 w-full"
                >
                    <p className="font-sans text-[12px] leading-[1.6] text-white/35 font-light tracking-wide break-words">
                        {error}
                    </p>
                </motion.div>

                {/* Actions */}
                <motion.div variants={fadeUp} className="flex flex-wrap gap-3 justify-center">
                    {onRetry && (
                        <motion.button
                            whileHover={{ scale: 1.03, y: -1 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={onRetry}
                            className="bg-white text-black font-sans text-[12px] font-medium tracking-[0.1em] uppercase px-6 py-3 flex items-center gap-2 hover:bg-white/85 transition-colors duration-200"
                        >
                            Tentar novamente
                            <IconArrowRight size={14} />
                        </motion.button>
                    )}
                    <motion.a
                        href="/"
                        whileHover={{ scale: 1.02 }}
                        className="border border-white/20 text-white font-sans text-[12px] tracking-[0.1em] uppercase px-6 py-3 flex items-center gap-2 hover:border-white/45 hover:bg-white/[0.04] transition-[border-color,background] duration-200"
                    >
                        Voltar à loja
                    </motion.a>
                </motion.div>
            </motion.div>
        </div>
    );
}