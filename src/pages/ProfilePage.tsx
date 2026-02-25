// src/pages/ProfilePage.tsx
import { useEffect, useState, useCallback} from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { useUserProfile } from "../hooks/useUserProfile";
import { Header } from "../components/Header";
import { MobileMenu } from "../components/MobileMenu";
import { NoiseOverlay } from "../components/NoiseOverlay";
import {
  IconUser,
  IconMail,
  IconArrowRight,
  IconFileText,
  IconLoader,
  IconCheck,
  IconAlertCircle,
  IconX,
  IconExternalLink,
} from "../components/Icons";
import { LoadingState } from "../components/ui/StatesScreens";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfileFormValues {
  name:  string;
  email: string;
  slug:  string;
  bio:   string;
}

type SaveStatus = "idle" | "saving" | "success" | "error";

// ─── Motion Variants ──────────────────────────────────────────────────────────

const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const slideDown: Variants = {
  hidden:  { opacity: 0, y: -8, height: 0 },
  visible: { opacity: 1, y: 0,  height: "auto", transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: -6, height: 0,       transition: { duration: 0.22 } },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface FieldProps {
  id:          string;
  label:       string;
  hint?:       string;
  icon:        React.ReactNode;
  children:    React.ReactNode;
}

function Field({ id, label, hint, icon, children }: FieldProps) {
  return (
    <motion.div variants={fadeUp} className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="font-sans text-[10px] tracking-[0.22em] uppercase text-white/40 font-medium"
      >
        {label}
      </label>
      <div className="relative flex items-start border border-white/[0.1] transition-[border-color] duration-200 focus-within:border-white/30 group">
        <span className="absolute left-4 top-[17px] text-white/25 pointer-events-none group-focus-within:text-white/45 transition-colors duration-200">
          {icon}
        </span>
        {children}
      </div>
      {hint && (
        <p className="font-sans text-[10px] italic text-white/20 leading-relaxed">{hint}</p>
      )}
    </motion.div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

interface AvatarProps {
  name: string;
}

function Avatar({ name }: AvatarProps) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="relative w-16 h-16 border border-white/[0.12] flex items-center justify-center bg-white/[0.03] shrink-0">
      {initials ? (
        <span
          className="[font-family:'Playfair_Display',serif] font-bold text-white/70 select-none"
          style={{ fontSize: 22 }}
        >
          {initials}
        </span>
      ) : (
        <span className="text-white/20">
          <IconUser size={22} />
        </span>
      )}
    </div>
  );
}

// ─── Status Banner ────────────────────────────────────────────────────────────

interface StatusBannerProps {
  status:    SaveStatus;
  errorMsg:  string | null;
  onDismiss: () => void;
}

function StatusBanner({ status, errorMsg, onDismiss }: StatusBannerProps) {
  if (status === "idle" || status === "saving") return null;

  const isSuccess = status === "success";

  return (
    <motion.div
      variants={slideDown}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={[
        "flex items-start gap-3 border px-4 py-3 overflow-hidden",
        isSuccess
          ? "border-white/[0.14] bg-white/[0.04]"
          : "border-white/[0.1]  bg-white/[0.02]",
      ].join(" ")}
    >
      <span className="text-white/50 mt-0.5 shrink-0">
        {isSuccess ? <IconCheck size={14} /> : <IconAlertCircle size={14} />}
      </span>
      <p className="font-sans text-[12px] leading-[1.55] text-white/55 flex-1">
        {isSuccess ? "Perfil atualizado com sucesso!" : errorMsg}
      </p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Fechar"
        className="text-white/25 hover:text-white/55 transition-colors shrink-0 mt-0.5"
      >
        <IconX size={13} />
      </button>
    </motion.div>
  );
}

// ─── ProfilePage ──────────────────────────────────────────────────────────────

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading, error: profileError, updateProfile } = useUserProfile();
  const [menuOpen, setMenuOpen] = useState(false);

  const [form, setForm] = useState<ProfileFormValues>({
    name: "", email: "", slug: "", bio: "",
  });

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveError,  setSaveError]  = useState<string | null>(null);

  // ── Redirect unauthenticated users ────────────────────────────────────────
  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  // ── Populate form once profile loads ──────────────────────────────────────
  useEffect(() => {
    if (!profile) return;
    setForm({
      name:  profile.name  ?? "",
      email: profile.email ?? "",
      slug:  profile.slug  ?? "",
      bio:   profile.bio   ?? "",
    });
  }, [profile]);

  // ── Auto-dismiss success banner ────────────────────────────────────────────
  useEffect(() => {
    if (saveStatus !== "success") return;
    const id = setTimeout(() => setSaveStatus("idle"), 3500);
    return () => clearTimeout(id);
  }, [saveStatus]);

  // ── Field setter (avoids one handler per field) ───────────────────────────
  const setField = useCallback(
    <K extends keyof ProfileFormValues>(key: K, value: ProfileFormValues[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleUpdate = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setSaveStatus("saving");
      setSaveError(null);

      const { error } = await updateProfile(form);

      if (error) {
        setSaveError(error.message);
        setSaveStatus("error");
      } else {
        setSaveStatus("success");
      }
    },
    [form, updateProfile]
  );

  // ── Sign out ──────────────────────────────────────────────────────────────
  const handleSignOut = useCallback(async () => {
    await signOut();
    navigate("/login");
  }, [signOut, navigate]);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-black">
        <LoadingState message="Carregando perfil..." />
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 overflow-x-hidden pt-16">
      <NoiseOverlay />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

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
        className="fixed inset-0 bg-[radial-gradient(ellipse_55%_55%_at_50%_50%,rgba(255,255,255,0.04)_0%,transparent_70%)] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="fixed left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/[0.06] to-transparent pointer-events-none"
      />

      {/* ── Content ────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-[680px] mx-auto px-6 md:px-8 py-20">

        {/* ── Header ───────────────────────────────────────────────────── */}
        <motion.header
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mb-14"
        >
          {/* Nav row removed, using main Header instead */}
          
          {/* Avatar + title row */}
          <motion.div variants={fadeUp} className="flex items-end gap-5">
            <Avatar name={form.name} />
            <div className="flex flex-col gap-1 pb-1">
              <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/35 border-l-2 border-white/20 pl-3">
                Perfil do usuário
              </span>
              <h1
                className="[font-family:'Playfair_Display',serif] font-bold leading-[1.05] tracking-[-0.02em]"
                style={{ fontSize: "clamp(28px,4vw,46px)" }}
              >
                Personalize sua
                <br />
                <em className="not-italic text-white/60">experiência.</em>
              </h1>
            </div>
          </motion.div>
        </motion.header>

        {/* ── Profile error notice ──────────────────────────────────────── */}
        <AnimatePresence>
          {profileError && (
            <motion.div
              variants={slideDown}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mb-6 flex items-start gap-3 border border-white/[0.1] px-4 py-3"
            >
              <span className="text-white/40 mt-0.5 shrink-0"><IconAlertCircle size={14} /></span>
              <p className="font-sans text-[12px] text-white/45 leading-[1.55]">
                Não foi possível carregar os dados do perfil: {profileError}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Form ─────────────────────────────────────────────────────── */}
        <form onSubmit={handleUpdate}>
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm p-8 md:p-10 flex flex-col gap-7"
          >

            {/* Name */}
            <Field id="name" label="Nome Completo" icon={<IconUser size={15} />}>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Seu nome"
                className="w-full bg-transparent py-4 pl-11 pr-4 font-sans text-[13px] text-white placeholder-white/20 outline-none"
              />
            </Field>

            {/* Email */}
            <Field id="email" label="E-mail" icon={<IconMail size={15} />}>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="seu@email.com"
                className="w-full bg-transparent py-4 pl-11 pr-4 font-sans text-[13px] text-white placeholder-white/20 outline-none"
              />
            </Field>

            {/* Slug */}
            <Field
              id="slug"
              label="URL Personalizada (Slug)"
              hint="Este identificador será exibido no seu perfil público."
              icon={<IconExternalLink size={15} />}
            >
              <input
                id="slug"
                type="text"
                value={form.slug}
                onChange={(e) =>
                  setField("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))
                }
                placeholder="seu-identificador"
                className="w-full bg-transparent py-4 pl-11 pr-4 font-mono text-[13px] text-white placeholder-white/20 outline-none tracking-wide"
              />
            </Field>

            {/* Bio */}
            <Field id="bio" label="Sobre você" icon={<IconFileText size={15} />}>
              <textarea
                id="bio"
                value={form.bio}
                onChange={(e) => setField("bio", e.target.value)}
                placeholder="Conte-nos um pouco sobre você..."
                rows={4}
                className="w-full bg-transparent py-4 pl-11 pr-4 font-sans text-[13px] text-white placeholder-white/20 outline-none resize-none leading-relaxed"
              />
            </Field>

            {/* Divider */}
            <div className="h-px bg-white/[0.07]" />

            {/* Status banner */}
            <AnimatePresence>
              {(saveStatus === "success" || saveStatus === "error") && (
                <StatusBanner
                  key="status"
                  status={saveStatus}
                  errorMsg={saveError}
                  onDismiss={() => setSaveStatus("idle")}
                />
              )}
            </AnimatePresence>

            {/* Actions */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 pt-1">
              {/* Save */}
              <motion.button
                type="submit"
                disabled={saveStatus === "saving"}
                whileHover={saveStatus === "saving" ? {} : { scale: 1.02, y: -1 }}
                whileTap={saveStatus === "saving" ? {} : { scale: 0.97 }}
                className="flex-1 bg-white text-black font-sans text-[11px] font-bold tracking-[0.18em] uppercase py-4 flex items-center justify-center gap-2 hover:bg-white/85 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saveStatus === "saving" ? (
                  <><IconLoader size={14} /> Salvando...</>
                ) : (
                  <>Salvar Alterações <IconArrowRight size={14} /></>
                )}
              </motion.button>

              {/* Sign out */}
              <motion.button
                type="button"
                onClick={handleSignOut}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 border border-white/[0.1] font-sans text-[11px] tracking-[0.18em] uppercase text-white/40 hover:text-white hover:border-white/30 transition-[color,border-color] duration-200"
              >
                Sair da conta
              </motion.button>
            </motion.div>
          </motion.div>
        </form>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-8 text-center font-sans text-[10px] tracking-[0.15em] uppercase text-white/15"
        >
          © 2025 Focus Conhecimento
        </motion.p>
      </div>
    </div>
  );
}