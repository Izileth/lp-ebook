import { useState, useEffect, useRef } from "react";
import { animate, useMotionValue, useTransform } from "framer-motion";

// ─── Constants ────────────────────────────────────────────────────────────────

const DURATION_MS = 3200;

const LOADING_STEPS = [
  "Inicializando plataforma",
  "Carregando biblioteca",
  "Preparando conteúdo",
  "Quase lá",
] as const;

interface UseSplashScreenProgress {
  progress: number;
  stepIndex: number;
  reveal: boolean;
  exiting: boolean;
}

export function useSplashScreenProgress(onLoadingComplete: () => void): UseSplashScreenProgress {
  const [progress, setProgress] = useState(0);          // 0-100
  const [stepIndex, setStepIndex] = useState(0);          // current label
  const [reveal, setReveal] = useState(false);       // logo reveal phase
  const [exiting, setExiting] = useState(false);       // exit phase
  const startTime = useRef<number>(0);
  const rafRef = useRef<number>(0);

  // Drive progress via rAF for a smooth, non-linear feel
  useEffect(() => {
    startTime.current = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime.current;
      const raw = Math.min(elapsed / DURATION_MS, 1);

      // Ease-in-out curve so it decelerates near 100%
      const eased = raw < 0.5
        ? 2 * raw * raw
        : 1 - Math.pow(-2 * raw + 2, 2) / 2;

      const pct = Math.floor(eased * 100);
      setProgress(pct);

      // Update loading message
      const stepAt = Math.floor(eased * LOADING_STEPS.length);
      setStepIndex(Math.min(stepAt, LOADING_STEPS.length - 1));

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Brief pause at 100% before exit
        setTimeout(() => setReveal(true), 200);
        setTimeout(() => {
          setExiting(true);
          setTimeout(onLoadingComplete, 700);
        }, 1000);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onLoadingComplete]);

  return { progress, stepIndex, reveal, exiting };
}

// ─── Animated counter sub-component ─────────────────────────────────────────

interface AnimatedNumberProps {
  to: number;
  duration: number;
}

export function AnimatedNumber({ to, duration }: AnimatedNumberProps) {
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.floor(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(motionVal, to, {
      duration: duration / 1000,
      ease: "easeInOut",
    });
    const unsub = rounded.on("change", setDisplay);
    return () => { controls.stop(); unsub(); };
  }, [to, duration, motionVal, rounded]);

  return {display};
}

export { LOADING_STEPS, DURATION_MS };
