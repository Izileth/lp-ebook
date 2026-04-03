// src/components/QuizSection.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconArrowRight,
  IconCheck,
  IconMail,
  IconShield,
  IconTrendingUp,
  IconHeart,
  IconActivity,
  IconRefresh,
} from "./Icons";
import { useProducts } from "../hooks/useProducts";
import { useNewsletter } from "../hooks/useNewsletter";

import type { Variants } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = "finanças" | "relacionamentos" | "saúde" | "geral";

interface QuizState {
  step: number;
  category: Category;
  intensity: string;
  situation: string;
  frustration: string;
  attempts: string;
  block: string;
  belief: string;
  desire: string;
  urgency: string;
  commitment: string;
  email: string;
  isAnalyzing: boolean;
  isFinished: boolean;
}

// ─── Steps config ─────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, title: "Ponto de partida" },
  { id: 2, title: "Intensidade" },
  { id: 3, title: "Situação atual" },
  { id: 4, title: "Raiz do problema" },
  { id: 5, title: "Histórico" },
  { id: 6, title: "Bloqueio central" },
  { id: 7, title: "Mapa mental" },
  { id: 8, title: "Visão de futuro" },
  { id: 9, title: "Urgência" },
  { id: 10, title: "Comprometimento" },
  { id: 11, title: "Captura" },
];

const LETTERS = ["A", "B", "C", "D"];

// ─── Variants ─────────────────────────────────────────────────────────────────

const slideVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.38,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    x: -24,
    transition: {
      duration: 0.22,
      ease: [0.7, 0, 1, 1] as const,
    },
  },
};
// ─── Sub-components ───────────────────────────────────────────────────────────


function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        padding: 24,
        backdropFilter: "blur(12px)",
      }}
    >
      {children}
    </div>
  );
}
function OptionButton({
  letter,
  label,
  onClick,
}: {
  letter: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-3 w-full p-4 text-left rounded-2xl transition-all duration-200 group"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        color: "rgba(255,255,255,0.65)",
        fontSize: 14,
        fontFamily: "inherit",
        cursor: "pointer",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.background = "rgba(16,185,129,0.07)";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(16,185,129,0.28)";
        (e.currentTarget as HTMLElement).style.color = "#fff";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
        (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)";
      }}
    >
      <span
        className="flex items-center justify-center rounded-lg flex-shrink-0 text-[11px] font-bold transition-all duration-200"
        style={{
          width: 28, height: 28,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.25)",
        }}
      >
        {letter}
      </span>
      {label}
    </motion.button>
  );
}

function AnalyzingScreen({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="mb-6"
        style={{
          width: 36, height: 36,
          border: "2px solid rgba(16,185,129,0.15)",
          borderTopColor: "#10b981",
          borderRadius: "50%",
        }}
      />
      <h4
        className="font-bold mb-2"
        style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(18px,2.5vw,22px)" }}
      >
        {message}
      </h4>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
        Muitas pessoas nessa fase passam por isso.
      </p>
    </div>
  );
}

function Progress({ progress, step, total }: { progress: number; step: number; total: number }) {
  return (
    <div className="flex items-center gap-3 mb-7">
      <div
        className="flex-1 rounded-full overflow-hidden"
        style={{ height: 2, background: "rgba(255,255,255,0.06)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg,#10b981,#34d399)" }}
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>
        {step} / {total}
      </span>
    </div>
  );
}

function Question({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="mb-6 leading-snug"
      style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(20px,2.5vw,26px)",
        fontWeight: 700,
        color: "#fff",
      }}
    >
      {children}
    </p>
  );
}


function StepTag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="block mb-3"
      style={{
        fontSize: 9,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "rgba(16,185,129,0.65)",
      }}
    >
      {children}
    </span>
  );
}
// ─── Main Component ───────────────────────────────────────────────────────────

export function QuizSection() {
  const [state, setState] = useState<QuizState>({
    step: 1,
    category: "geral",
    intensity: "",
    situation: "",
    frustration: "",
    attempts: "",
    block: "",
    belief: "",
    desire: "",
    urgency: "",
    commitment: "",
    email: "",
    isAnalyzing: false,
    isFinished: false,
  });

  const { products } = useProducts(state.category === "geral" ? undefined : state.category);
  const { subscribe, loading: subLoading } = useNewsletter();

  const advance = (updates: Partial<QuizState>, analyzeDelay?: number, analyzeMsg?: string) => {
    if (analyzeDelay && analyzeMsg) {
      setState(prev => ({ ...prev, ...updates, isAnalyzing: true }));
      setTimeout(() => {
        setState(prev => ({ ...prev, step: prev.step + 1, isAnalyzing: false }));
      }, analyzeDelay);
    } else {
      setState(prev => ({ ...prev, ...updates, step: prev.step + 1 }));
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.email) return;
    setState(prev => ({ ...prev, isAnalyzing: true }));
    await subscribe(state.email);
    setTimeout(() => {
      setState(prev => ({ ...prev, isAnalyzing: false, isFinished: true }));
    }, 1800);
  };


  const recommended = products[0] ?? {
    name: "Guia de Transformação",
    description: "O método definitivo para sua mudança de padrão.",
    checkout_url: "#",
  };


  const progress = Math.round((state.step / STEPS.length) * 100);

  // ──────────────────────────────────────────────────────────────────────────
  //  Render
  // ──────────────────────────────────────────────────────────────────────────

  return (
    <section
      id="quiz"
      className="relative"
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "80px 40px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0 48px",
        alignItems: "center",
      }}
    >
      {/* ── LEFT COLUMN: persistent pitch ────────────────────────────────── */}
      <div style={{ paddingRight: 40, position: "sticky", top: 80 }}>
        {/* Eyebrow */}
        <div
          className="flex items-center gap-2 mb-6"
          style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(16,185,129,0.8)" }}
        >
          <span style={{ width: 20, height: 1, background: "rgba(16,185,129,0.6)", display: "block" }} />
          Diagnóstico Pessoal
        </div>

        {/* Heading */}
        <h2
          className="mb-5 leading-[1.05]"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(34px,4vw,52px)",
            fontWeight: 900,
            letterSpacing: "-0.02em",
          }}
        >
          Descubra o que{" "}
          <em style={{ fontStyle: "normal", color: "rgba(255,255,255,0.32)" }}>está te</em>{" "}
          impedindo de evoluir
        </h2>

        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.38)", lineHeight: 1.75, marginBottom: 36, maxWidth: 380 }}>
          Em menos de 3 minutos, nosso método identifica seu maior bloqueio e entrega uma recomendação personalizada para a sua realidade.
        </p>

        {/* Stats */}
        <div className="flex items-stretch gap-6 mb-10">
          {[
            { num: "94%", label: "Identificam o bloqueio" },
            { num: "12k+", label: "Diagnósticos feitos" },
          ].map((s, i) => (
            <div key={i} className="flex items-stretch gap-6">
              {i > 0 && <div style={{ width: 1, background: "rgba(255,255,255,0.07)" }} />}
              <div className="flex flex-col gap-1">
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "#10b981" }}>
                  {s.num}
                </span>
                <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)" }}>
                  {s.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Trust */}
        <div className="flex items-center gap-2" style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(16,185,129,0.5)", display: "block" }} />
          100% gratuito
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(16,185,129,0.5)", display: "block", marginLeft: 6 }} />
          Resultado imediato
        </div>
      </div>

      {/* ── RIGHT COLUMN: quiz card ───────────────────────────────────────── */}
      <div>
        <Card>
          <Progress progress={progress} step={state.step} total={STEPS.length} />
          <AnimatePresence mode="wait">
            {/* ANALYZING */}
            {state.isAnalyzing && (
              <motion.div key="analyzing" variants={slideVariants} initial="hidden" animate="visible" exit="exit">
                <AnalyzingScreen
                  message={
                    state.step === 2 ? "Analisando sua intensidade..." :
                      state.step === 4 ? "Processando sua frustração..." :
                        state.step === 7 ? "Desenhando seu perfil psicológico..." :
                          state.step === 10 ? "Gerando seu diagnóstico final..." :
                            state.step === 11 ? "Preparando seu diagnóstico..." :
                              "Processando suas respostas..."
                  }
                />
              </motion.div>
            )}

            {/* FINISHED */}
            {!state.isAnalyzing && state.isFinished && (
              <motion.div key="result" variants={slideVariants} initial="hidden" animate="visible" exit="exit">
                {/* Badge */}
                <div
                  className="inline-flex items-center gap-2 rounded-full mb-4"
                  style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.18)", padding: "5px 14px", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#10b981" }}
                >
                  <IconCheck size={12} /> Perfil Identificado
                </div>

                <h3
                  className="mb-4 leading-snug"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px,2.5vw,28px)", fontWeight: 700 }}
                >
                  Reconstrutor{" "}
                  <span style={{ color: "rgba(255,255,255,0.32)" }}>
                    {state.category.charAt(0).toUpperCase() + state.category.slice(1)}
                  </span>
                </h3>

                <div
                  className="rounded-2xl mb-3"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", padding: 16 }}
                >
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.48)", lineHeight: 1.7 }}>
                    Sua prioridade é{" "}
                    <strong style={{ color: "rgba(255,255,255,0.8)" }}>{state.category}</strong>.
                    A frustração com{" "}
                    <em>"{state.frustration}"</em>{" "}
                    indica saturação emocional que exige mudança de método, não de esforço.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: "Situação atual", val: state.situation, em: false },
                    { label: "Nível de urgência", val: state.urgency, em: true },
                  ].map(c => (
                    <div
                      key={c.label}
                      className="rounded-xl"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", padding: 12 }}
                    >
                      <span style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", display: "block", marginBottom: 5 }}>
                        {c.label}
                      </span>
                      <p style={{ fontSize: 12, color: c.em ? "#10b981" : "rgba(255,255,255,0.72)", lineHeight: 1.45 }}>
                        {c.val}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Recommendation card */}
                <div
                  className="rounded-2xl text-center"
                  style={{
                    background: "linear-gradient(135deg,rgba(16,185,129,0.1),rgba(16,185,129,0.04))",
                    border: "1px solid rgba(16,185,129,0.2)",
                    padding: "20px 16px",
                  }}
                >
                  <h4
                    className="mb-1"
                    style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700 }}
                  >
                    {recommended.name}
                  </h4>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", marginBottom: 16, lineHeight: 1.55 }}>
                    {recommended.description?.substring(0, 90)}…
                  </p>
                  <a
                    href={recommended.checkout_url ?? "#"}
                    className="inline-flex items-center gap-2 rounded-full font-bold uppercase"
                    style={{
                      background: "#10b981",
                      color: "#fff",
                      padding: "11px 24px",
                      fontSize: 12,
                      letterSpacing: "0.08em",
                      textDecoration: "none",
                      boxShadow: "0 0 24px rgba(16,185,129,0.25)",
                    }}
                  >
                    Acessar meu guia <IconArrowRight size={12} />
                  </a>
                </div>
              </motion.div>
            )}

            {/* QUIZ STEPS */}
            {!state.isAnalyzing && !state.isFinished && (
              <motion.div key={state.step} variants={slideVariants} initial="hidden" animate="visible" exit="exit">

                {/* STEP 1 */}
                {state.step === 1 && (
                  <div>
                    <StepTag>Ponto de partida</StepTag>
                    <Question>Se você pudesse transformar uma área da sua vida, qual seria?</Question>
                    <div className="flex flex-col gap-3">
                      {[
                        { id: "finanças", label: "Finanças e prosperidade", icon: <IconTrendingUp /> },
                        { id: "relacionamentos", label: "Amor e relacionamentos", icon: <IconHeart /> },
                        { id: "saúde", label: "Saúde e energia", icon: <IconActivity /> },
                        { id: "geral", label: "Múltiplas áreas da minha vida", icon: <IconRefresh /> },
                      ].map((o, i) => (
                        <OptionButton key={o.id} letter={LETTERS[i]} label={o.label}
                          onClick={() => advance({ category: o.id as Category })} />
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2 */}
                {state.step === 2 && (
                  <div>
                    <StepTag>Intensidade</StepTag>
                    <Question>O quanto essa área tem te incomodado ultimamente?</Question>
                    <div className="flex flex-col gap-3">
                      {["Um pouco", "Bastante", "Muito", "Tirado minha paz"].map((o, i) => (
                        <OptionButton key={o} letter={LETTERS[i]} label={o}
                          onClick={() => advance({ intensity: o }, 1500, "Analisando sua intensidade...")} />
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 3 */}
                {state.step === 3 && (
                  <div>
                    <StepTag>Situação atual</StepTag>
                    <Question>Qual frase descreve melhor sua situação hoje?</Question>
                    <div className="flex flex-col gap-3">
                      {(state.category === "finanças"
                        ? ["Não consigo guardar dinheiro", "Vivo no limite do salário", "Quero aprender a multiplicar dinheiro", "Me sinto atrasado financeiramente"]
                        : state.category === "relacionamentos"
                          ? ["Dificuldade em encontrar alguém", "Relacionamentos que não dão certo", "Estou bem mas quero melhorar", "Quero entender melhor as pessoas"]
                          : state.category === "saúde"
                            ? ["Vivo cansado sem energia", "Dificuldade de cuidar da saúde", "Quero melhorar minha qualidade de vida", "Busco mais disciplina física"]
                            : ["Estagnado em várias áreas", "Quero um recomeço total", "Procuro mais disciplina", "Quero organizar minha rotina"]
                      ).map((o, i) => (
                        <OptionButton key={o} letter={LETTERS[i]} label={o}
                          onClick={() => advance({ situation: o })} />
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 4 */}
                {state.step === 4 && (
                  <div>
                    <StepTag>Raiz do problema</StepTag>
                    <Question>O que mais te frustra nessa área da sua vida?</Question>
                    <div className="flex flex-col gap-3">
                      {(state.category === "finanças"
                        ? ["Trabalhar muito sem resultado", "O dinheiro nunca sobra", "Não saber como investir", "Sentir que estou atrasado financeiramente"]
                        : state.category === "relacionamentos"
                          ? ["Sempre atrair pessoas erradas", "Falta de conexão verdadeira", "Brigas e conflitos constantes", "Medo de ficar sozinho"]
                          : state.category === "saúde"
                            ? ["Falta de energia crônica", "Falta de disciplina", "Falta de motivação", "Saúde abaixo do potencial"]
                            : ["Procrastinação", "Falta de foco", "Desorganização", "Inconstância em tudo"]
                      ).map((o, i) => (
                        <OptionButton key={o} letter={LETTERS[i]} label={o}
                          onClick={() => advance({ frustration: o }, 1800, "Processando sua frustração...")} />
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 5 */}
                {state.step === 5 && (
                  <div>
                    <StepTag>Histórico</StepTag>
                    <Question>Você já tentou resolver essa situação antes?</Question>
                    <div className="flex flex-col gap-3">
                      {["Nunca tentei", "Já tentei algumas coisas", "Estudei bastante sobre isso", "Tive resultado mas não mantive"].map((o, i) => (
                        <OptionButton key={o} letter={LETTERS[i]} label={o}
                          onClick={() => advance({ attempts: o })} />
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 6 */}
                {state.step === 6 && (
                  <div>
                    <StepTag>Bloqueio central</StepTag>
                    <Question>O que você acredita que mais te impede de mudar?</Question>
                    <div className="flex flex-col gap-3">
                      {["Falta de conhecimento", "Falta de disciplina", "Falta de tempo", "Falta de orientação"].map((o, i) => (
                        <OptionButton key={o} letter={LETTERS[i]} label={o}
                          onClick={() => advance({ block: o })} />
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 7 */}
                {state.step === 7 && (
                  <div>
                    <StepTag>Mapa mental</StepTag>
                    <Question>Qual dessas frases mais te representa?</Question>
                    <div className="flex flex-col gap-3">
                      {[
                        "Sei que posso mudar, falta o método certo",
                        "Acho que estou fazendo algo errado",
                        "Nunca me ensinaram o caminho certo",
                        "Quero entender meu padrão de comportamento",
                      ].map((o, i) => (
                        <OptionButton key={o} letter={LETTERS[i]} label={o}
                          onClick={() => advance({ belief: o }, 2000, "Desenhando seu perfil psicológico...")} />
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 8 */}
                {state.step === 8 && (
                  <div>
                    <StepTag>Visão de futuro</StepTag>
                    <Question>Se essa área melhorasse muito, o que mudaria?</Question>
                    <div className="flex flex-col gap-3">
                      {["Teria mais liberdade", "Teria mais confiança", "Teria mais tranquilidade", "Minha vida seria completamente diferente"].map((o, i) => (
                        <OptionButton key={o} letter={LETTERS[i]} label={o}
                          onClick={() => advance({ desire: o })} />
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 9 */}
                {state.step === 9 && (
                  <div>
                    <StepTag>Urgência</StepTag>
                    <Question>Em quanto tempo quer transformar essa situação?</Question>
                    <div className="flex flex-col gap-3">
                      {["O mais rápido possível", "Nos próximos meses", "Ainda estou pensando nisso"].map((o, i) => (
                        <OptionButton key={o} letter={LETTERS[i]} label={o}
                          onClick={() => advance({ urgency: o })} />
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 10 */}
                {state.step === 10 && (
                  <div>
                    <StepTag>Comprometimento</StepTag>
                    <Question>Se existisse um método comprovado para isso, você aplicaria?</Question>
                    <div className="flex flex-col gap-3">
                      {["Sim, com certeza", "Talvez", "Ainda tenho dúvidas"].map((o, i) => (
                        <OptionButton key={o} letter={LETTERS[i]} label={o}
                          onClick={() => advance({ commitment: o }, 1500, "Gerando seu diagnóstico final...")} />
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 11: lead capture */}
                {state.step === 11 && (
                  <div className="text-center">
                    <div
                      className="inline-flex items-center gap-2 rounded-full mb-5"
                      style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.18)", padding: "6px 14px", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#10b981" }}
                    >
                      <IconShield size={12} /> Diagnóstico Gerado
                    </div>
                    <h3
                      className="mb-3"
                      style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px,3vw,28px)", fontWeight: 700 }}
                    >
                      Receba seu resultado completo
                    </h3>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.32)", marginBottom: 24, lineHeight: 1.65 }}>
                      Insira seu melhor e-mail para liberar seu perfil psicológico e recomendação personalizada.
                    </p>

                    <form onSubmit={handleEmailSubmit} className="space-y-3 max-w-sm mx-auto text-left">
                      <div className="relative">
                        <IconMail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16}/>
                        <input
                          required
                          type="email"
                          placeholder="seu@email.com"
                          value={state.email}
                          onChange={e => setState(p => ({ ...p, email: e.target.value }))}
                          className="w-full rounded-xl py-4 pl-11 pr-4 focus:outline-none transition-colors"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "#fff",
                            fontSize: 14,
                            fontFamily: "inherit",
                          }}
                          onFocus={e => (e.target.style.borderColor = "rgba(16,185,129,0.5)")}
                          onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={subLoading}
                        className="w-full flex items-center justify-center gap-2 rounded-xl font-bold uppercase transition-all"
                        style={{
                          background: "#10b981",
                          color: "#fff",
                          padding: "15px",
                          fontSize: 13,
                          letterSpacing: "0.06em",
                          fontFamily: "inherit",
                          cursor: "pointer",
                          border: "none",
                          opacity: subLoading ? 0.7 : 1,
                        }}
                      >
                        {subLoading ? "Processando..." : "Ver Meu Diagnóstico"}
                        <IconArrowRight size={16} />
                      </button>
                    </form>
                    <p
                      className="flex items-center justify-center gap-2 mt-5"
                      style={{ fontSize: 10, color: "rgba(255,255,255,0.18)", letterSpacing: "0.12em", textTransform: "uppercase" }}
                    >
                      <IconShield size={12} /> Sua privacidade é nossa prioridade
                    </p>
                  </div>
                )}

              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </section>
  );
}