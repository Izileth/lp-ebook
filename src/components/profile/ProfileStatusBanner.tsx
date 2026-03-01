import { motion } from "framer-motion";
import { IconCheck, IconAlertCircle, IconX } from "../Icons";
import { slideDown } from "./variants";

export type SaveStatus = "idle" | "saving" | "success" | "error";

interface ProfileStatusBannerProps {
  status: SaveStatus;
  errorMsg: string | null;
  onDismiss: () => void;
}

export function ProfileStatusBanner({ status, errorMsg, onDismiss }: ProfileStatusBannerProps) {
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
