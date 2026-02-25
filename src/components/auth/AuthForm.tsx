// src/components/auth/AuthForm.tsx
import { useState} from "react";
import type { FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import {
  IconMail,
  IconLock,
  IconArrowRight,
  IconCheck,
  IconAlertCircle,
  IconLoader,
  IconEye,
  IconX,
  IconUser,
} from "../Icons";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthFormProps {
  onSuccess: () => void;
}

type Mode = "login" | "signup";

// ─── Variants ─────────────────────────────────────────────────────────────────

const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};

const fadeIn: Variants = {
  hidden:  { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1,   transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, scale: 0.97,              transition: { duration: 0.25 } },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface InputFieldProps {
  id: string;
  type: string;
  label: string;
  value: string;
  placeholder: string;
  icon: React.ReactNode;
  onChange: (v: string) => void;
  required?: boolean;
  action?: React.ReactNode;
}

function InputField({
  id, type, label, value, placeholder, icon, onChange, required, action,
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <motion.div variants={fadeUp} className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="font-sans text-[11px] tracking-[0.18em] uppercase text-white/40"
      >
        {label}
      </label>
      <div
        className="relative flex items-center border transition-[border-color] duration-200"
        style={{ borderColor: focused ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.1)" }}
      >
        {/* Left icon */}
        <span className="absolute left-4 text-white/25 pointer-events-none">
          {icon}
        </span>

        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent text-white placeholder-white/20 font-sans text-[13px] tracking-wide py-4 pl-11 pr-11 outline-none"
        />

        {/* Right action slot */}
        {action && (
          <span className="absolute right-4 text-white/30 cursor-pointer hover:text-white/60 transition-colors">
            {action}
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ─── AuthForm ─────────────────────────────────────────────────────────────────

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [mode, setMode]                 = useState<Mode>("login");
  const [name, setName]                 = useState("");
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError]       = useState<string | null>(null);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const { signInWithEmail, signUpWithEmail, loading } = useAuth();

  const isSignUp = mode === "signup";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSignUpSuccess(false);

    if (isSignUp) {
      const { user, error } = await signUpWithEmail(email, password, name);
      if (error) setFormError(error.message);
      else if (user) setSignUpSuccess(true);
    } else {
      const { user, error } = await signInWithEmail(email, password);
      if (error) setFormError(error.message);
      else if (user) onSuccess();
    }
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setFormError(null);
    setSignUpSuccess(false);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black text-white overflow-hidden">
      {/* ── Background decoration ────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_55%_55%_at_50%_50%,rgba(255,255,255,0.04)_0%,transparent_70%)] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/[0.06] to-transparent pointer-events-none"
      />
      {/* Decorative rings */}
      {[380, 560, 720].map((size, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="absolute rounded-full border border-white/[0.03] pointer-events-none"
          style={{ width: size, height: size }}
        />
      ))}

      {/* ── Card ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-[400px] mx-4">
        <AnimatePresence mode="wait">

          {/* ── Sign-up success ──────────────────────────────────────── */}
          {signUpSuccess ? (
            <motion.div
              key="success"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="border border-white/[0.1] bg-black/60 backdrop-blur-sm p-10 flex flex-col items-center gap-6 text-center"
            >
              <div className="w-12 h-12 bg-white text-black flex items-center justify-center">
                <IconCheck size={20} />
              </div>

              <div className="flex flex-col gap-2">
                <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/35">
                  Cadastro realizado
                </p>
                <h2
                  className="[font-family:'Playfair_Display',serif] font-bold leading-[1.1]"
                  style={{ fontSize: "clamp(22px,3vw,30px)" }}
                >
                  Bem-vindo ao
                  <br />
                  <em className="not-italic text-white/65">FOCUS.</em>
                </h2>
              </div>

              <p className="font-sans font-light text-[13px] leading-[1.7] text-white/45 max-w-[280px]">
                Sua conta foi criada com sucesso para <strong className="text-white/70 font-normal">{email}</strong>.
                Você já pode acessar todos os conteúdos.
              </p>

              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => switchMode("login")}
                className="w-full bg-white text-black font-sans text-[12px] font-medium tracking-[0.1em] uppercase py-3.5 flex items-center justify-center gap-2 hover:bg-white/85 transition-colors"
              >
                Ir para o Login
                <IconArrowRight size={14} />
              </motion.button>
            </motion.div>

          ) : (

            /* ── Main form ──────────────────────────────────────────── */
            <motion.div
              key={mode}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="border border-white/[0.1] bg-black/60 backdrop-blur-sm p-8 md:p-10"
            >
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-6"
              >
                {/* Header */}
                <motion.div variants={fadeUp} className="flex flex-col gap-3">
                  {/* Logo */}
                  <div className="flex items-baseline gap-2 mb-2">
                    <span
                      className="[font-family:'Playfair_Display',serif] font-bold tracking-[0.02em]"
                      style={{ fontSize: 18 }}
                    >
                      FOCUS
                    </span>
                    <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/25">
                      | Conhecimento
                    </span>
                  </div>

                  <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/35 border-l-2 border-white/20 pl-3">
                    {isSignUp ? "Criar conta" : "Acessar conta"}
                  </span>
                  <h1
                    className="[font-family:'Playfair_Display',serif] font-bold leading-[1.05] tracking-[-0.02em]"
                    style={{ fontSize: "clamp(26px,3.5vw,36px)" }}
                  >
                    {isSignUp ? (
                      <>Comece sua<br /><em className="not-italic text-white/65">jornada.</em></>
                    ) : (
                      <>Bem-vindo<br /><em className="not-italic text-white/65">de volta.</em></>
                    )}
                  </h1>
                </motion.div>

                {/* Divider */}
                <motion.div variants={fadeUp} className="h-px w-full bg-white/[0.07]" />

                {/* Fields */}
                <div className="flex flex-col gap-4">
                  {isSignUp && (
                    <InputField
                      id="name"
                      type="text"
                      label="Nome Completo"
                      placeholder="Como deseja ser chamado?"
                      value={name}
                      icon={<IconUser size={15} />}
                      onChange={setName}
                      required
                    />
                  )}
                  <InputField
                    id="email"
                    type="email"
                    label="E-mail"
                    placeholder="seu@email.com"
                    value={email}
                    icon={<IconMail size={15} />}
                    onChange={setEmail}
                    required
                  />
                  <InputField
                    id="password"
                    type={showPassword ? "text" : "password"}
                    label="Senha"
                    placeholder={isSignUp ? "Mínimo 8 caracteres" : "••••••••"}
                    value={password}
                    icon={<IconLock size={15} />}
                    onChange={setPassword}
                    required
                    action={
                      <span onClick={() => setShowPassword((v) => !v)}>
                        <IconEye size={15} />
                      </span>
                    }
                  />
                </div>

                {/* Error */}
                <AnimatePresence>
                  {formError && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-start gap-3 border border-white/[0.1] px-4 py-3"
                    >
                      <span className="text-white/40 mt-0.5 shrink-0">
                        <IconAlertCircle size={15} />
                      </span>
                      <p className="font-sans text-[12px] leading-[1.55] text-white/50">
                        {formError}
                      </p>
                      <button
                        type="button"
                        onClick={() => setFormError(null)}
                        className="ml-auto text-white/25 hover:text-white/55 transition-colors shrink-0"
                      >
                        <IconX size={13} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <motion.div variants={fadeUp}>
                  <motion.button
                    form="auth-form"
                    type="submit"
                    disabled={loading}
                    whileHover={loading ? {} : { scale: 1.02, y: -1 }}
                    whileTap={loading ? {} : { scale: 0.97 }}
                    className="w-full bg-white text-black font-sans text-[12px] font-medium tracking-[0.1em] uppercase py-4 flex items-center justify-center gap-2 hover:bg-white/85 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <IconLoader size={14} />
                        Processando...
                      </>
                    ) : (
                      <>
                        {isSignUp ? "Criar conta" : "Entrar"}
                        <IconArrowRight size={14} />
                      </>
                    )}
                  </motion.button>
                </motion.div>

                {/* Toggle mode */}
                <motion.div variants={fadeUp} className="text-center">
                  <button
                    type="button"
                    onClick={() => switchMode(isSignUp ? "login" : "signup")}
                    className="font-sans text-[11px] tracking-[0.1em] text-white/35 hover:text-white/70 transition-colors duration-200 uppercase"
                  >
                    {isSignUp
                      ? "Já tem uma conta? Entrar"
                      : "Não tem conta? Cadastrar-se"}
                  </button>
                </motion.div>
              </motion.div>

              {/* Native form — tied to submit button via form="auth-form" */}
              <form
                id="auth-form"
                onSubmit={handleSubmit}
                className="sr-only"
                aria-hidden="true"
                tabIndex={-1}
              >
                {isSignUp && <input type="text" value={name} readOnly />}
                <input type="email"    value={email}    readOnly />
                <input type="password" value={password} readOnly />
                <button type="submit" />
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}