// src/pages/NotFound.tsx
import { useState } from 'react';
import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { MobileMenu } from "../components/MobileMenu";
import { NoiseOverlay } from "../components/NoiseOverlay";
import { IconArrowLeft } from "../components/Icons";

export function NotFound() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-black min-h-screen text-white pt-16">
      <NoiseOverlay />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] gap-6 px-6">
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
        <div className="text-center -mt-8 relative z-10">
          <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-white/35 mb-3">
            Página não encontrada
          </p>
          <h2
            className="font-bold mb-8"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px,3vw,36px)" }}
          >
            Este caminho não existe
          </h2>
          <Link
            to="/"
            className="inline-flex items-center gap-2 border border-white/20 text-white font-sans text-[12px] tracking-[0.12em] uppercase px-8 py-4 hover:border-white/50 hover:bg-white/[0.04] transition-all"
          >
            <IconArrowLeft size={14} />
            Voltar para a home
          </Link>
        </div>
      </main>
    </div>
  );
}
