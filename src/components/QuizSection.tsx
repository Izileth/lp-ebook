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
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 md:p-8 backdrop-blur-xl h-full flex flex-col justify-center">
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
      className="flex items-center gap-3 w-full p-4 text-left rounded-2xl transition-all duration-200 group bg-white/[0.03] border border-white/[0.07] text-white/65 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-white"
    >
      <span className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 text-[11px] font-bold transition-all duration-200 bg-white/5 border border-white/10 text-white/25 group-hover:border-emerald-500/40 group-hover:text-emerald-500">
        {letter}
      </span>
      <span className="text-sm font-sans">{label}</span>
    </motion.button>
  );
}

function AnalyzingScreen({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="mb-6 w-9 h-9 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full"
      />
      <h4 className="font-bold mb-2 [font-family:'Playfair_Display',serif] text-xl md:text-2xl text-white">
        {message}
      </h4>
      <p className="text-sm text-white/30 font-sans">
        Muitas pessoas nessa fase passam por isso.
      </p>
    </div>
  );
}

function Progress({ progress, step, total }: { progress: number; step: number; total: number }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="flex-1 h-0.5 rounded-full overflow-hidden bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <span className="text-[10px] font-sans text-white/20 whitespace-nowrap">
        {step} / {total}
      </span>
    </div>
  );
}

function Question({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-8 [font-family:'Playfair_Display',serif] text-2xl md:text-3xl font-bold text-white leading-[1.2] tracking-tight">
      {children}
    </h3>
  );
}

function StepTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="block mb-3 text-[10px] tracking-[0.2em] uppercase text-emerald-500/60 font-sans font-medium">
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

  return (
    <section id="quiz" className="px-10 py-[100px] border-b border-white/[0.05] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] h-full pointer-events-none opacity-[0.03]" style={{ background: 'radial-gradient(circle at center, #10b981 0%, transparent 70%)' }} />

      <div className="max-w-[1200px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* ── LEFT COLUMN: persistent pitch ────────────────────────────────── */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-6 h-[1px] bg-emerald-500/60" />
              <span className="text-[11px] font-sans tracking-[0.25em] uppercase text-emerald-500/80">
                Diagnóstico Pessoal
              </span>
            </div>

            <h2 className="[font-family:'Playfair_Display',serif] text-[clamp(36px,5vw,56px)] font-black leading-[1.05] tracking-[-0.03em] mb-8 text-white">
              Descubra o que{" "}
              <em className="not-italic text-white/30">está te</em>{" "}
              impedindo de evoluir
            </h2>

            <p className="font-sans text-base text-white/40 leading-[1.8] mb-12 max-w-[420px]">
              Em menos de 3 minutos, nosso método identifica seu maior bloqueio e entrega uma recomendação personalizada para a sua realidade.
            </p>

            {/* Stats */}
            <div className="flex gap-12 mb-12">
              {[
                { num: "94%", label: "Precisão do bloqueio" },
                { num: "12k+", label: "Resultados entregues" },
              ].map((s, i) => (
                <div key={i} className="flex gap-12 items-center">
                  {i > 0 && <div className="w-[1px] h-12 bg-white/10" />}
                  <div>
                    <span className="block [font-family:'Playfair_Display',serif] text-4xl font-bold text-emerald-500 mb-1">
                      {s.num}
                    </span>
                    <span className="block text-[10px] font-sans tracking-[0.1em] uppercase text-white/30">
                      {s.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust markers */}
            <div className="flex items-center gap-6 flex-wrap">
              {[
                "100% gratuito",
                "Privacidade total",
                "Resultado imediato"
              ].map(t => (
                <div key={t} className="flex items-center gap-2 text-[10px] font-sans tracking-[0.1em] uppercase text-white/20 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT COLUMN: quiz card ───────────────────────────────────────── */}
          <div className="lg:col-span-7 w-full lg:max-w-[620px]">
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
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full text-[10px] tracking-[0.15em] uppercase text-emerald-500 mb-6">
                      <IconCheck size={12} /> Perfil Identificado
                    </div>

                    <h3 className="[font-family:'Playfair_Display',serif] text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                      Reconstrutor <br />
                      <span className="text-white/30">{state.category.charAt(0).toUpperCase() + state.category.slice(1)}</span>
                    </h3>

                    <div className="bg-white/[0.03] border border-white/[0.08] p-6 rounded-2xl mb-6">
                      <p className="font-sans text-sm text-white/50 leading-relaxed">
                        Sua prioridade é <strong className="text-white/80">{state.category}</strong>. 
                        Sua frustração com <em className="text-white/70 italic">"{state.frustration}"</em> indica que você atingiu um nível de saturação emocional que exige uma mudança de método, não apenas de esforço.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      {[
                        { label: "Foco Principal", val: state.situation, em: false },
                        { label: "Urgência", val: state.urgency, em: true },
                      ].map(c => (
                        <div key={c.label} className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-xl">
                          <span className="block text-[9px] tracking-[0.15em] uppercase text-white/25 mb-2">{c.label}</span>
                          <p className={`text-xs font-sans font-medium leading-relaxed ${c.em ? 'text-emerald-500' : 'text-white/70'}`}>
                            {c.val}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Recommendation card */}
                    <div className="bg-emerald-500/[0.08] border border-emerald-500/20 p-8 rounded-3xl text-center relative overflow-hidden group">
                      <div className="absolute inset-0 bg-emerald-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <h4 className="[font-family:'Playfair_Display',serif] text-2xl font-bold text-white mb-3 relative">
                        {recommended.name}
                      </h4>
                      <p className="text-sm font-sans text-white/40 mb-8 max-w-[280px] mx-auto relative leading-relaxed">
                        {recommended.description?.substring(0, 100)}…
                      </p>
                      
                      <a
                        href={recommended.checkout_url ?? "#"}
                        className="inline-flex items-center gap-2 bg-emerald-500 text-white px-8 py-3.5 rounded-full font-sans text-[12px] font-bold uppercase tracking-wider hover:bg-emerald-600 transition-all hover:scale-[1.02] active:scale-[0.98] relative shadow-[0_10px_30px_rgba(16,185,129,0.3)]"
                      >
                        Acessar meu guia <IconArrowRight size={14} />
                      </a>
                    </div>
                  </motion.div>
                )}

                {/* QUIZ STEPS */}
                {!state.isAnalyzing && !state.isFinished && (
                  <motion.div key={state.step} variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col">
                    
                    {/* Render current step based on state.step */}
                    {state.step === 1 && (
                      <>
                        <StepTag>Ponto de partida</StepTag>
                        <Question>Se você pudesse transformar uma área da sua vida, qual seria?</Question>
                        <div className="grid gap-3">
                          {[
                            { id: "finanças", label: "Finanças e prosperidade", icon: <IconTrendingUp /> },
                            { id: "relacionamentos", label: "Amor e relacionamentos", icon: <IconHeart /> },
                            { id: "saúde", label: "Saúde e energia", icon: <IconActivity /> },
                            { id: "geral", label: "Múltiplas áreas da minha vida", icon: <IconRefresh /> },
                          ].map((o, i) => (
                            <OptionButton key={o.id} letter={LETTERS[i]} label={o.label} onClick={() => advance({ category: o.id as Category })} />
                          ))}
                        </div>
                      </>
                    )}

                    {state.step === 2 && (
                      <>
                        <StepTag>Intensidade</StepTag>
                        <Question>O quanto essa área tem te incomodado ultimamente?</Question>
                        <div className="grid gap-3">
                          {["Um pouco", "Bastante", "Muito", "Tirado minha paz"].map((o, i) => (
                            <OptionButton key={o} letter={LETTERS[i]} label={o} onClick={() => advance({ intensity: o }, 1500, "Analisando sua intensidade...")} />
                          ))}
                        </div>
                      </>
                    )}

                    {state.step === 3 && (
                      <>
                        <StepTag>Situação atual</StepTag>
                        <Question>Qual frase descreve melhor sua situação hoje?</Question>
                        <div className="grid gap-3">
                          {(state.category === "finanças"
                            ? ["Não consigo guardar dinheiro", "Vivo no limite do salário", "Quero aprender a multiplicar dinheiro", "Me sinto atrasado financeiramente"]
                            : state.category === "relacionamentos"
                              ? ["Dificuldade em encontrar alguém", "Relacionamentos que não dão certo", "Estou bem mas quero melhorar", "Quero entender melhor as pessoas"]
                              : state.category === "saúde"
                                ? ["Vivo cansado sem energia", "Dificuldade de cuidar da saúde", "Quero melhorar minha qualidade de vida", "Busco mais disciplina física"]
                                : ["Estagnado em várias áreas", "Quero um recomeço total", "Procuro mais disciplina", "Quero organizar minha rotina"]
                          ).map((o, i) => (
                            <OptionButton key={o} letter={LETTERS[i]} label={o} onClick={() => advance({ situation: o })} />
                          ))}
                        </div>
                      </>
                    )}

                    {state.step === 4 && (
                      <>
                        <StepTag>Raiz do problema</StepTag>
                        <Question>O que mais te frustra nessa área da sua vida?</Question>
                        <div className="grid gap-3">
                          {(state.category === "finanças"
                            ? ["Trabalhar muito sem resultado", "O dinheiro nunca sobra", "Não saber como investir", "Sentir que estou atrasado financeiramente"]
                            : state.category === "relacionamentos"
                              ? ["Sempre atrair pessoas erradas", "Falta de conexão verdadeira", "Brigas e conflitos constantes", "Medo de ficar sozinho"]
                              : state.category === "saúde"
                                ? ["Falta de energia crônica", "Falta de disciplina", "Falta de motivação", "Saúde abaixo do potencial"]
                                : ["Procrastinação", "Falta de foco", "Desorganização", "Inconstância em tudo"]
                          ).map((o, i) => (
                            <OptionButton key={o} letter={LETTERS[i]} label={o} onClick={() => advance({ frustration: o }, 1800, "Processando sua frustração...")} />
                          ))}
                        </div>
                      </>
                    )}

                    {state.step === 5 && (
                      <>
                        <StepTag>Histórico</StepTag>
                        <Question>Você já tentou resolver essa situação antes?</Question>
                        <div className="grid gap-3">
                          {["Nunca tentei", "Já tentei algumas coisas", "Estudei bastante sobre isso", "Tive resultado mas não mantive"].map((o, i) => (
                            <OptionButton key={o} letter={LETTERS[i]} label={o} onClick={() => advance({ attempts: o })} />
                          ))}
                        </div>
                      </>
                    )}

                    {state.step === 6 && (
                      <>
                        <StepTag>Bloqueio central</StepTag>
                        <Question>O que você acredita que mais te impede de mudar?</Question>
                        <div className="grid gap-3">
                          {["Falta de conhecimento", "Falta de disciplina", "Falta de tempo", "Falta de orientação"].map((o, i) => (
                            <OptionButton key={o} letter={LETTERS[i]} label={o} onClick={() => advance({ block: o })} />
                          ))}
                        </div>
                      </>
                    )}

                    {state.step === 7 && (
                      <>
                        <StepTag>Mapa mental</StepTag>
                        <Question>Qual dessas frases mais te representa?</Question>
                        <div className="grid gap-3">
                          {[
                            "Sei que posso mudar, falta o método certo",
                            "Acho que estou fazendo algo errado",
                            "Nunca me ensinaram o caminho certo",
                            "Quero entender meu padrão de comportamento",
                          ].map((o, i) => (
                            <OptionButton key={o} letter={LETTERS[i]} label={o} onClick={() => advance({ belief: o }, 2000, "Desenhando seu perfil psicológico...")} />
                          ))}
                        </div>
                      </>
                    )}

                    {state.step === 8 && (
                      <>
                        <StepTag>Visão de futuro</StepTag>
                        <Question>Se essa área melhorasse muito, o que mudaria?</Question>
                        <div className="grid gap-3">
                          {["Teria mais liberdade", "Teria mais confiança", "Teria mais tranquilidade", "Minha vida seria diferente"].map((o, i) => (
                            <OptionButton key={o} letter={LETTERS[i]} label={o} onClick={() => advance({ desire: o })} />
                          ))}
                        </div>
                      </>
                    )}

                    {state.step === 9 && (
                      <>
                        <StepTag>Urgência</StepTag>
                        <Question>Em quanto tempo quer transformar essa situação?</Question>
                        <div className="grid gap-3">
                          {["O mais rápido possível", "Nos próximos meses", "Ainda estou pensando nisso"].map((o, i) => (
                            <OptionButton key={o} letter={LETTERS[i]} label={o} onClick={() => advance({ urgency: o })} />
                          ))}
                        </div>
                      </>
                    )}

                    {state.step === 10 && (
                      <>
                        <StepTag>Comprometimento</StepTag>
                        <Question>Se existisse um método comprovado para isso, você aplicaria?</Question>
                        <div className="grid gap-3">
                          {["Sim, com certeza", "Talvez", "Ainda tenho dúvidas"].map((o, i) => (
                            <OptionButton key={o} letter={LETTERS[i]} label={o} onClick={() => advance({ commitment: o }, 1500, "Gerando seu diagnóstico final...")} />
                          ))}
                        </div>
                      </>
                    )}

                    {state.step === 11 && (
                      <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full text-[10px] tracking-[0.12em] uppercase text-emerald-500 mb-6 font-sans">
                          <IconShield size={12} /> Diagnóstico Gerado
                        </div>
                        <h3 className="[font-family:'Playfair_Display',serif] text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                          Receba seu resultado <br className="hidden md:block" /> completo
                        </h3>
                        <p className="font-sans text-sm text-white/40 mb-10 leading-relaxed max-w-[320px] mx-auto">
                          Insira seu melhor e-mail para liberar seu perfil psicológico e recomendação personalizada.
                        </p>

                        <form onSubmit={handleEmailSubmit} className="space-y-3 max-w-sm mx-auto">
                          <div className="relative group">
                            <IconMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-emerald-500 transition-colors" size={16}/>
                            <input
                              required
                              type="email"
                              placeholder="seu@email.com"
                              value={state.email}
                              onChange={e => setState(p => ({ ...p, email: e.target.value }))}
                              className="w-full bg-white/[0.04] border border-white/[0.1] text-white rounded-xl py-4 pl-12 pr-4 text-sm font-sans focus:outline-none focus:border-emerald-500/50 transition-all"
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={subLoading}
                            className="w-full bg-emerald-500 text-white py-4 rounded-xl font-sans text-xs font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                          >
                            {subLoading ? "Processando..." : (
                              <>
                                Ver Meu Diagnóstico 
                                <IconArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                              </>
                            )}
                          </button>
                        </form>
                        
                        <div className="flex items-center justify-center gap-2 mt-8 text-[9px] font-sans tracking-[0.1em] uppercase text-white/20">
                          <IconShield size={10} />
                          Sua privacidade é nossa prioridade
                        </div>
                      </div>
                    )}

                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
