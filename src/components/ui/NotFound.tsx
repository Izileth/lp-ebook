import { Link } from "react-router-dom";
import { IconArrowLeft } from "../Icons";

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white gap-6">
      <span
        className="font-black text-white/[0.04] select-none pointer-events-none"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(100px,18vw,220px)",
          lineHeight: 1,
        }}
      >
        404
      </span>
      <div className="text-center -mt-8">
        <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-white/35 mb-3">
          Página não encontrada
        </p>
        <h2
          className="font-bold mb-8"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px,3vw,36px)" }}
        >
          Conteúdo não encontrado
        </h2>
        <Link
          to="/"
          className="inline-flex items-center gap-2 border border-white/20 text-white font-sans text-[12px] tracking-[0.12em] uppercase px-6 py-3 hover:border-white/50 hover:bg-white/[0.04] transition-[border-color,background]"
        >
          <IconArrowLeft />
          Voltar para a loja
        </Link>
      </div>
    </div>
  );
}
