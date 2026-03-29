// src/components/EPSDPSection.tsx
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  IconZap, IconTrendingUp, IconCheckCircle,
  IconArrowRight, IconSettings, IconAward, IconClock,
} from "./Icons";

import type { Variants } from "framer-motion";
// ─── Motion Variants ──────────────────────────────────────────────────────────

const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const PILARES = [
  { letter: "E", title: "Estratégia",  desc: "Alinhamento de objetivos com recursos cognitivos.",     icon: <IconZap         size={14} /> },
  { letter: "P", title: "Performance", desc: "Otimização de rotinas para estados de flow constante.", icon: <IconTrendingUp  size={14} /> },
  { letter: "S", title: "Sistemas",    desc: "Arquiteturas de suporte que automatizam a atenção.",    icon: <IconSettings    size={14} /> },
  { letter: "D", title: "Dados",       desc: "Feedback loops baseados em neurociência aplicada.",     icon: <IconCheckCircle size={14} /> },
  { letter: "P", title: "Processos",   desc: "Iteração contínua para resultados de longo prazo.",     icon: <IconArrowRight  size={14} /> },
];

const TRIADE = [
  { label: "Mente",    desc: "Clareza mental e gestão da atenção como ativos estratégicos." },
  { label: "Método",   desc: "Sistemas repetíveis que operam independente de motivação." },
  { label: "Momentum", desc: "Aceleração composta: pequenos ganhos diários que se multiplicam." },
];

const BAR_DATA = [
  { label: "Foco",     before: 28, after: 94 },
  { label: "Clareza",  before: 42, after: 89 },
  { label: "Execução", before: 18, after: 83 },
  { label: "Retenção", before: 38, after: 91 },
];

const LINE_POINTS = [10, 15, 12, 22, 20, 35, 30, 50, 46, 65, 62, 79, 75, 90, 95];

const RADIAL_DATA = [
  { label: "Foco",        value: 92 },
  { label: "Consistência",value: 85 },
  { label: "Clareza",     value: 88 },
  { label: "Execução",    value: 78 },
  { label: "Energia",     value: 82 },
];

const MINI_WEEKS = [18, 25, 22, 35, 32, 48, 44, 60, 58, 72, 70, 85];

// ─── useChartInView helper ────────────────────────────────────────────────────

function useChartInView() {
  const ref    = useRef<SVGSVGElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, amount: 0.35 });
  return { ref, inView };
}

// BarChart uses its own SVGSVGElement ref directly (same pattern, explicit for clarity)

// ─── 1. Bar Chart (SVG) ───────────────────────────────────────────────────────

function BarChart() {
  const ref    = useRef<SVGSVGElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, amount: 0.35 });

  const W       = 320;
  const H       = 100;        // chart area height
  const DELTA_H = 16;         // space above bars for value labels
  const LABEL_H = 16;         // space below baseline for X labels
  const TOTAL_H = DELTA_H + H + LABEL_H;

  const groups  = BAR_DATA.length;
  const groupW  = W / groups;
  const barW    = (groupW - 10) / 2;
  const barGap  = 4;

  return (
    <div className="flex flex-col gap-3">
      {/* Legend */}
      <div className="flex items-center gap-4 justify-end">
        {[
          { label: "Antes",         fill: "rgba(255,255,255,0.08)", stroke: "rgba(255,255,255,0.2)"  },
          { label: "Após E.P.S.D.P",fill: "rgba(255,255,255,0.65)", stroke: "rgba(255,255,255,0.45)" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <svg width="12" height="8" aria-hidden="true">
              <rect x="0" y="0" width="12" height="8" fill={l.fill} stroke={l.stroke} strokeWidth="0.8" />
            </svg>
            <span className="font-sans text-[9px] tracking-[0.15em] uppercase text-white/35">{l.label}</span>
          </div>
        ))}
      </div>

      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${TOTAL_H}`}
        className="w-full"
        style={{ height: 130 }}
        aria-label="Gráfico de barras: impacto nos pilares"
      >
        {/* Horizontal grid */}
        {[25, 50, 75, 100].map((pct) => {
          const y = DELTA_H + H - (pct / 100) * H;
          return (
            <g key={pct}>
              <line x1={0} y1={y} x2={W} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              <text x={2} y={y - 2} fill="rgba(255,255,255,0.18)" fontSize="6.5" fontFamily="DM Sans, sans-serif">{pct}</text>
            </g>
          );
        })}

        {/* Bars */}
        {BAR_DATA.map((item, gi) => {
          const hBefore = (item.before / 100) * H;
          const hAfter  = (item.after  / 100) * H;

          const groupX  = gi * groupW + 3;
          const xBefore = groupX;
          const xAfter  = groupX + barW + barGap;

          const yBefore = DELTA_H + H - hBefore;
          const yAfter  = DELTA_H + H - hAfter;

          return (
            <g key={item.label}>
              {/* Value label above after-bar */}
              <motion.text
                x={xAfter + barW / 2}
                y={yAfter - 3}
                fill="rgba(255,255,255,0.35)"
                fontSize="7"
                textAnchor="middle"
                fontFamily="DM Sans, sans-serif"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: gi * 0.12 + 0.9, duration: 0.4 }}
              >
                {item.after}%
              </motion.text>

              {/* Before bar — y and height animate from baseline upward */}
              <motion.rect
                x={xBefore} width={barW}
                fill="rgba(255,255,255,0.12)"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="0.5"
                initial={{ y: DELTA_H + H, height: 0 }}
                animate={inView
                  ? { y: yBefore, height: hBefore }
                  : { y: DELTA_H + H, height: 0 }}
                transition={{ duration: 0.8, delay: gi * 0.1, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* After bar */}
              <motion.rect
                x={xAfter} width={barW}
                fill="rgba(255,255,255,0.65)"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="0.5"
                initial={{ y: DELTA_H + H, height: 0 }}
                animate={inView
                  ? { y: yAfter, height: hAfter }
                  : { y: DELTA_H + H, height: 0 }}
                transition={{ duration: 1, delay: gi * 0.12 + 0.1, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* X label */}
              <text
                x={groupX + barW + barGap / 2}
                y={DELTA_H + H + 13}
                fill="rgba(255,255,255,0.3)"
                fontSize="7"
                textAnchor="middle"
                fontFamily="DM Sans, sans-serif"
              >
                {item.label}
              </text>
            </g>
          );
        })}

        {/* Baseline */}
        <line x1={0} y1={DELTA_H + H} x2={W} y2={DELTA_H + H} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      </svg>
    </div>
  );
}

// ─── 2. Line Chart (SVG) ─────────────────────────────────────────────────────

function LineChart() {
  const { ref, inView } = useChartInView();
  const W = 320, H = 80;

  const xs = LINE_POINTS.map((_, i) => (i / (LINE_POINTS.length - 1)) * W);
  const ys = LINE_POINTS.map((v)     => H - (v / 100) * H);

  const pathD = LINE_POINTS.map((_, i) =>
    `${i === 0 ? "M" : "L"} ${xs[i].toFixed(1)} ${ys[i].toFixed(1)}`
  ).join(" ");
  const areaD = `${pathD} L ${W} ${H} L 0 ${H} Z`;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-sans text-[9px] tracking-[0.18em] uppercase text-white/30">Curva de evolução</span>
        <span className="[font-family:'Playfair_Display',serif] font-bold text-white text-[13px]">+310%</span>
      </div>

      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height: 80 }}
        aria-label="Gráfico de linha: curva de evolução"
      >
        <defs>
          <linearGradient id="lg-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="white" stopOpacity="0.07" />
            <stop offset="100%" stopColor="white" stopOpacity="0"    />
          </linearGradient>
          <clipPath id="cp-line">
            <motion.rect
              x="0" y="0" height={H}
              initial={{ width: 0 }}
              animate={inView ? { width: W } : { width: 0 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            />
          </clipPath>
        </defs>

        {[25, 50, 75].map((pct) => (
          <line key={pct}
            x1={0} y1={H - (pct / 100) * H}
            x2={W} y2={H - (pct / 100) * H}
            stroke="rgba(255,255,255,0.04)" strokeWidth="1"
          />
        ))}

        <path d={areaD} fill="url(#lg-area)" clipPath="url(#cp-line)" />

        <motion.path
          d={pathD}
          fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        />

        <motion.circle
          cx={xs[xs.length - 1]} cy={ys[ys.length - 1]}
          r="3" fill="white"
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ delay: 1.4, duration: 0.35 }}
        />
      </svg>

      <div className="flex justify-between mt-1">
        {["Sem 1", "Sem 4", "Sem 8", "Sem 12"].map((l) => (
          <span key={l} className="font-sans text-[8px] tracking-[0.1em] uppercase text-white/20">{l}</span>
        ))}
      </div>
    </div>
  );
}

// ─── 3. Radial / Spider mini chart (SVG) ──────────────────────────────────────

function RadialChart() {
  const { ref, inView } = useChartInView();

  const cx = 80, cy = 80, R = 60;
  const count = RADIAL_DATA.length;

  const axes = RADIAL_DATA.map((_, i) => {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
    return {
      x: cx + R * Math.cos(angle),
      y: cy + R * Math.sin(angle),
      lx: cx + (R + 14) * Math.cos(angle),
      ly: cy + (R + 14) * Math.sin(angle),
    };
  });

  // Web rings at 25%, 50%, 75%, 100%
  const ring = (pct: number) => RADIAL_DATA.map((_, i) => {
    const r    = R * (pct / 100);
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
    return `${i === 0 ? "M" : "L"} ${(cx + r * Math.cos(angle)).toFixed(1)} ${(cy + r * Math.sin(angle)).toFixed(1)}`;
  }).join(" ") + " Z";

  const dataPath = (scale: number) =>
    RADIAL_DATA.map((d, i) => {
      const r     = R * (d.value / 100) * scale;
      const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
      return `${i === 0 ? "M" : "L"} ${(cx + r * Math.cos(angle)).toFixed(1)} ${(cy + r * Math.sin(angle)).toFixed(1)}`;
    }).join(" ") + " Z";

  return (
    <div className="flex flex-col gap-2">
      <span className="font-sans text-[9px] tracking-[0.18em] uppercase text-white/30">
        Cobertura multidimensional
      </span>
      <svg
        ref={ref}
        viewBox="0 0 200 160"
        className="w-full"
        style={{ height: 140 }}
        aria-label="Gráfico radar: cobertura multidimensional"
      >
        {/* Rings */}
        {[25, 50, 75, 100].map((pct) => (
          <path key={pct} d={ring(pct)} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" />
        ))}

        {/* Spokes */}
        {axes.map((a, i) => (
          <line key={i} x1={cx} y1={cy} x2={a.x} y2={a.y} stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
        ))}

        {/* Data fill */}
        <motion.path
          d={dataPath(1)}
          fill="rgba(255,255,255,0.07)"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="1"
          initial={{ scale: 0, originX: "50%", originY: "50%" }}
          animate={inView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        />

        {/* Labels */}
        {axes.map((a, i) => (
          <text
            key={i}
            x={a.lx} y={a.ly}
            fill="rgba(255,255,255,0.3)"
            fontSize="7"
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="DM Sans, sans-serif"
          >
            {RADIAL_DATA[i].label}
          </text>
        ))}

        {/* Dots on data path */}
        {RADIAL_DATA.map((d, i) => {
          const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
          const r = R * (d.value / 100);
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          return (
            <motion.circle
              key={i} cx={x} cy={y} r="2"
              fill="white"
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 0.7, scale: 1 } : { opacity: 0, scale: 0 }}
              transition={{ delay: 0.9 + i * 0.07, duration: 0.3 }}
            />
          );
        })}
      </svg>
    </div>
  );
}

// ─── 4. Mini sparkline (weekly consistency) ───────────────────────────────────

function SparklineChart() {
  const { ref, inView } = useChartInView();

  const W = 320, H = 40;
  const xs = MINI_WEEKS.map((_, i) => (i / (MINI_WEEKS.length - 1)) * W);
  const ys = MINI_WEEKS.map((v)     => H - (v / 100) * H);

  const pathD = MINI_WEEKS.map((_, i) =>
    `${i === 0 ? "M" : "L"} ${xs[i].toFixed(1)} ${ys[i].toFixed(1)}`
  ).join(" ");
  const areaD = `${pathD} L ${W} ${H} L 0 ${H} Z`;

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col gap-0.5 shrink-0">
        <span className="[font-family:'Playfair_Display',serif] font-bold text-white text-[18px] leading-none">93%</span>
        <span className="font-sans text-[8px] tracking-[0.15em] uppercase text-white/30">Consistência</span>
      </div>

      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="flex-1"
        style={{ height: 40 }}
        aria-label="Sparkline: consistência semanal"
      >
        <defs>
          <linearGradient id="lg-spark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="white" stopOpacity="0.1" />
            <stop offset="100%" stopColor="white" stopOpacity="0"   />
          </linearGradient>
          <clipPath id="cp-spark">
            <motion.rect
              x="0" y="0" height={H}
              initial={{ width: 0 }}
              animate={inView ? { width: W } : { width: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </clipPath>
        </defs>
        <path d={areaD} fill="url(#lg-spark)" clipPath="url(#cp-spark)" />
        <motion.path
          d={pathD}
          fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2"
          strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>

      <div className="flex flex-col gap-0.5 items-end shrink-0">
        <div className="flex items-center gap-1">
          <div className="relative flex h-1.5 w-1.5">
            <motion.span
              animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-white/50"
            />
            <span className="relative rounded-full h-1.5 w-1.5 bg-white/70" />
          </div>
          <span className="font-sans text-[8px] tracking-[0.1em] uppercase text-white/30">12 sem</span>
        </div>
      </div>
    </div>
  );
}

// ─── EPSDPSection ─────────────────────────────────────────────────────────────

export function EPSDPSection() {
  return (
    <section id="metodo" className="relative border-t border-white/[0.06] py-24 md:py-32 overflow-hidden">

      {/* Noise */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div aria-hidden="true" className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/[0.05] to-transparent pointer-events-none" />

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.06 }}
        className="max-w-[1200px] mx-auto px-8 md:px-16"
      >

        {/* Section header */}
        <motion.div variants={fadeUp} className="mb-16 md:mb-20">
          <span className="font-sans text-[10px] tracking-[0.28em] uppercase text-white/30 border-l-2 border-white/20 pl-3 mb-4 block">
            A Metodologia
          </span>
          <h2
            className="[font-family:'Playfair_Display',serif] font-bold leading-[1.05] tracking-[-0.02em]"
            style={{ fontSize: "clamp(32px,5vw,60px)" }}
          >
            O Método <em className="not-italic text-white/45">E.P.S.D.P</em>
          </h2>
          <p
            className="font-sans font-light text-white/45 leading-[1.75] mt-4 max-w-[520px]"
            style={{ fontSize: "clamp(14px,1.2vw,16px)" }}
          >
            Não é sobre trabalhar mais — é sobre arquitetar sua mente para operar em frequências superiores de clareza e execução.
          </p>
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left: Pilares */}
          <div className="flex flex-col gap-8">
            {PILARES.map((p, i) => (
              <motion.div key={i} variants={fadeUp} className="flex items-start gap-5 group">
                <div className="w-10 h-10 shrink-0 border border-white/[0.1] bg-white/[0.02] flex items-center justify-center group-hover:border-white/25 group-hover:bg-white/[0.05] transition-[border-color,background] duration-300">
                  <span className="[font-family:'Playfair_Display',serif] font-bold text-white/70 group-hover:text-white transition-colors" style={{ fontSize: 16 }}>
                    {p.letter}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 pt-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-white/25">{p.icon}</span>
                    <h4 className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase text-white/70">{p.title}</h4>
                  </div>
                  <p className="font-sans font-light text-[13px] leading-[1.65] text-white/40">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: Charts stack */}
          <motion.div variants={fadeUp} className="flex flex-col gap-5">

            {/* Card 1: Bar + Line */}
            <div className="border border-white/[0.08] bg-white/[0.02] p-6 flex flex-col gap-7">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="font-sans text-[10px] tracking-[0.22em] uppercase text-white/30">Impacto nos pilares</span>
                  <h4 className="[font-family:'Playfair_Display',serif] font-bold text-white leading-tight" style={{ fontSize: "clamp(15px,2vw,19px)" }}>
                    Mensuração de performance
                  </h4>
                </div>
                <span className="font-sans text-[10px] font-medium tracking-[0.12em] uppercase text-white/35 border border-white/[0.12] px-2.5 py-1 shrink-0">
                  +310%
                </span>
              </div>

              <BarChart />

              <div className="h-px bg-white/[0.06]" />

              <LineChart />
            </div>

            {/* Card 2: Radar + Sparkline (support charts) */}
            <div className="border border-white/[0.08] bg-white/[0.02] p-6 flex flex-col gap-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="font-sans text-[10px] tracking-[0.22em] uppercase text-white/30">Diagnóstico completo</span>
                  <h4 className="[font-family:'Playfair_Display',serif] font-bold text-white leading-tight" style={{ fontSize: "clamp(15px,2vw,19px)" }}>
                    Visão multidimensional
                  </h4>
                </div>
                <span className="font-sans text-[10px] font-medium tracking-[0.12em] uppercase text-white/35 border border-white/[0.12] px-2.5 py-1 shrink-0 flex items-center gap-1.5">
                  <IconClock size={11} /> 12 sem
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6 items-start">
                <RadialChart />
                <div className="flex flex-col gap-3 pt-4">
                  {RADIAL_DATA.map((d) => (
                    <div key={d.label} className="flex flex-col gap-1">
                      <div className="flex justify-between">
                        <span className="font-sans text-[9px] tracking-[0.12em] uppercase text-white/35">{d.label}</span>
                        <span className="font-sans text-[9px] font-medium text-white/55">{d.value}%</span>
                      </div>
                      <div className="h-px bg-white/[0.06] relative overflow-hidden">
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-white/40"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${d.value}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-white/[0.06]" />

              <SparklineChart />
            </div>

            {/* Card 3: Tríade */}
            <div className="border border-white/[0.08] bg-white/[0.02] p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <span className="font-sans text-[10px] tracking-[0.22em] uppercase text-white/30">Tríade do alto desempenho</span>
                <h4 className="[font-family:'Playfair_Display',serif] font-bold text-white leading-tight" style={{ fontSize: "clamp(15px,2vw,19px)" }}>
                  Mente · Método · Momentum
                </h4>
              </div>

              <div className="h-px bg-white/[0.06]" />

              <div className="flex flex-col gap-4">
                {TRIADE.map((t, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="w-7 h-7 shrink-0 border border-white/[0.1] flex items-center justify-center">
                      <span className="[font-family:'Playfair_Display',serif] font-bold text-white/40 group-hover:text-white/70 transition-colors" style={{ fontSize: 11 }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5 pt-0.5">
                      <h5 className="font-sans text-[11px] font-medium tracking-[0.18em] uppercase text-white/65">{t.label}</h5>
                      <p className="font-sans font-light text-[12px] leading-[1.65] text-white/35">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-1 border-t border-white/[0.06] pt-4 flex items-start gap-3">
                <span className="text-white/20 shrink-0 mt-0.5"><IconAward size={14} /></span>
                <p className="font-sans text-[11px] leading-[1.6] text-white/30 italic">
                  A maioria foca apenas no "P" de Performance. O método E.P.S.D.P e a Tríade criam a estrutura que sustenta a performance no longo prazo.
                </p>
              </div>
            </div>

          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}