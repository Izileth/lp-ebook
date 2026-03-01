import type { FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconUser,
  IconMail,
  IconArrowRight,
  IconFileText,
  IconLoader,
  IconExternalLink,
} from "../Icons";
import { ProfileField } from "./ProfileField";
import { ProfileStatusBanner, type SaveStatus } from "./ProfileStatusBanner";
import { stagger, fadeUp } from "./variants";

interface ProfileFormValues {
  name: string;
  email: string;
  slug: string;
  bio: string;
}

interface ProfileFormProps {
  form: ProfileFormValues;
  setField: (key: keyof ProfileFormValues, value: string) => void;
  onSubmit: (e: FormEvent) => void;
  onSignOut: () => void;
  saveStatus: SaveStatus;
  saveError: string | null;
  onDismissStatus: () => void;
}

export function ProfileForm({
  form,
  setField,
  onSubmit,
  onSignOut,
  saveStatus,
  saveError,
  onDismissStatus,
}: ProfileFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm p-8 md:p-10 flex flex-col gap-7"
      >
        {/* Name */}
        <ProfileField id="name" label="Nome Completo" icon={<IconUser size={15} />}>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="Seu nome"
            className="w-full bg-transparent py-4 pl-11 pr-4 font-sans text-[13px] text-white placeholder-white/20 outline-none"
          />
        </ProfileField>

        {/* Email */}
        <ProfileField id="email" label="E-mail" icon={<IconMail size={15} />}>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            placeholder="seu@email.com"
            className="w-full bg-transparent py-4 pl-11 pr-4 font-sans text-[13px] text-white placeholder-white/20 outline-none"
          />
        </ProfileField>

        {/* Slug */}
        <ProfileField
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
        </ProfileField>

        {/* Bio */}
        <ProfileField id="bio" label="Sobre você" icon={<IconFileText size={15} />}>
          <textarea
            id="bio"
            value={form.bio}
            onChange={(e) => setField("bio", e.target.value)}
            placeholder="Conte-nos um pouco sobre você..."
            rows={4}
            className="w-full bg-transparent py-4 pl-11 pr-4 font-sans text-[13px] text-white placeholder-white/20 outline-none resize-none leading-relaxed"
          />
        </ProfileField>

        {/* Divider */}
        <div className="h-px bg-white/[0.07]" />

        {/* Status banner */}
        <AnimatePresence>
          {(saveStatus === "success" || saveStatus === "error") && (
            <ProfileStatusBanner
              key="status"
              status={saveStatus}
              errorMsg={saveError}
              onDismiss={onDismissStatus}
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
              <>
                <IconLoader size={14} /> Salvando...
              </>
            ) : (
              <>
                Salvar Alterações <IconArrowRight size={14} />
              </>
            )}
          </motion.button>

          {/* Sign out */}
          <motion.button
            type="button"
            onClick={onSignOut}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 border border-white/[0.1] font-sans text-[11px] tracking-[0.18em] uppercase text-white/40 hover:text-white hover:border-white/30 transition-[color,border-color] duration-200"
          >
            Sair da conta
          </motion.button>
        </motion.div>
      </motion.div>
    </form>
  );
}
