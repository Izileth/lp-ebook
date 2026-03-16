// src/components/ShareButtons.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IconTwitter, 
  IconLinkedin, 
  IconFacebook, 
  IconWhatsapp, 
  IconLink, 
  IconCheck 
} from "./Icons";

interface ShareButtonsProps {
  url: string;
  title: string;
  variant?: "minimal" | "full";
  className?: string;
}

export function ShareButtons({ url, title, variant = "full", className = "" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const fullUrl = window.location.origin + url;
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "Twitter",
      icon: <IconTwitter size={variant === "minimal" ? 14 : 16} />,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: "hover:text-[#1DA1F2]"
    },
    {
      name: "LinkedIn",
      icon: <IconLinkedin size={variant === "minimal" ? 14 : 16} />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "hover:text-[#0A66C2]"
    },
    {
      name: "Facebook",
      icon: <IconFacebook size={variant === "minimal" ? 14 : 16} />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:text-[#1877F2]"
    },
    {
      name: "WhatsApp",
      icon: <IconWhatsapp size={variant === "minimal" ? 14 : 16} />,
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      color: "hover:text-[#25D366]"
    }
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  if (variant === "minimal") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-white/20 transition-colors ${link.color}`}
            title={`Compartilhar no ${link.name}`}
            onClick={(e) => e.stopPropagation()}
          >
            {link.icon}
          </a>
        ))}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            copyToClipboard();
          }}
          className="text-white/20 hover:text-white transition-colors"
          title="Copiar Link"
        >
          {copied ? <IconCheck size={14} className="text-emerald-400" /> : <IconLink size={14} />}
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/30">Compartilhar Artigo</span>
      <div className="flex flex-wrap items-center gap-4">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-10 h-10 flex items-center justify-center border border-white/10 bg-white/5 text-white/40 transition-all hover:border-white/30 hover:bg-white/10 ${link.color}`}
            title={`Compartilhar no ${link.name}`}
          >
            {link.icon}
          </a>
        ))}
        <button
          onClick={copyToClipboard}
          className="h-10 px-4 flex items-center gap-3 border border-white/10 bg-white/5 text-white/40 transition-all hover:border-white/30 hover:bg-white/10 hover:text-white group"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-2 text-emerald-400"
              >
                <IconCheck size={14} />
                <span className="font-sans text-[11px] uppercase tracking-widest">Copiado</span>
              </motion.div>
            ) : (
              <motion.div
                key="link"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-2"
              >
                <IconLink size={14} />
                <span className="font-sans text-[11px] uppercase tracking-widest">Copiar Link</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}
