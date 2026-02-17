import { useState, useEffect, useRef } from "react";

const books = [
  {
    id: 1,
    title: "Mentalidade de Alto Desempenho",
    category: "Produtividade",
    price: "R$ 29,90",
    pages: "187 páginas",
    badge: "Mais Vendido",
  },
  {
    id: 2,
    title: "Finanças Pessoais na Prática",
    category: "Finanças",
    price: "R$ 24,90",
    pages: "142 páginas",
    badge: "Novo",
  },
  {
    id: 3,
    title: "Liderança Sem Título",
    category: "Liderança",
    price: "R$ 34,90",
    pages: "210 páginas",
    badge: null,
  },
  {
    id: 4,
    title: "Foco: A Arte de Não se Distrair",
    category: "Produtividade",
    price: "R$ 27,90",
    pages: "165 páginas",
    badge: "Destaque",
  },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useInView(0.1);
  const booksRef = useInView(0.1);
  const ctaRef = useInView(0.1);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", fontFamily: "'Georgia', 'Times New Roman', serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #fff3; border-radius: 2px; }

        .playfair { font-family: 'Playfair Display', Georgia, serif; }
        .dm { font-family: 'DM Sans', system-ui, sans-serif; }

        .fade-up {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.8s cubic-bezier(.16,1,.3,1), transform 0.8s cubic-bezier(.16,1,.3,1);
        }
        .fade-up.in { opacity: 1; transform: translateY(0); }
        .fade-up.d1 { transition-delay: 0.1s; }
        .fade-up.d2 { transition-delay: 0.22s; }
        .fade-up.d3 { transition-delay: 0.34s; }
        .fade-up.d4 { transition-delay: 0.46s; }

        .nav-link {
          color: #ffffff99;
          text-decoration: none;
          font-size: 13px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: color 0.2s;
        }
        .nav-link:hover { color: #fff; }

        .btn-primary {
          background: #fff;
          color: #000;
          border: none;
          padding: 14px 32px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, transform 0.15s;
          display: inline-block;
          text-decoration: none;
        }
        .btn-primary:hover { background: #e0e0e0; transform: translateY(-1px); }

        .btn-ghost {
          background: transparent;
          color: #fff;
          border: 1px solid #ffffff44;
          padding: 13px 28px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, transform 0.15s;
          display: inline-block;
          text-decoration: none;
        }
        .btn-ghost:hover { border-color: #fff; background: #ffffff08; transform: translateY(-1px); }

        .book-card {
          border: 1px solid #ffffff14;
          padding: 32px 28px;
          position: relative;
          transition: border-color 0.25s, transform 0.25s;
          cursor: pointer;
          background: #0a0a0a;
        }
        .book-card:hover { border-color: #ffffff55; transform: translateY(-4px); }

        .book-badge {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          background: #fff;
          color: #000;
          padding: 3px 10px;
          position: absolute;
          top: 20px;
          right: 20px;
        }

        .noise-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9999;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .line-accent {
          width: 1px;
          background: linear-gradient(to bottom, transparent, #ffffff66, transparent);
          position: absolute;
        }

        .mobile-menu {
          position: fixed;
          inset: 0;
          background: #000;
          z-index: 200;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 40px;
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(.16,1,.3,1);
        }
        .mobile-menu.open { transform: translateX(0); }
        .mobile-nav-link {
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          color: #fff;
          text-decoration: none;
          opacity: 0.6;
          transition: opacity 0.2s;
        }
        .mobile-nav-link:hover { opacity: 1; }

        .hero-number {
          font-family: 'Playfair Display', serif;
          font-size: clamp(140px, 22vw, 280px);
          font-weight: 900;
          line-height: 0.85;
          color: #ffffff06;
          position: absolute;
          right: -10px;
          bottom: -20px;
          pointer-events: none;
          user-select: none;
          letter-spacing: -0.05em;
        }

        .stat-item {
          border-left: 1px solid #ffffff22;
          padding-left: 24px;
        }

        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>

      {/* Noise texture overlay */}
      <div className="noise-overlay" />

      {/* Mobile Menu */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        <button
          onClick={() => setMenuOpen(false)}
          style={{ position: "absolute", top: 24, right: 24, background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 24 }}
        >
          ✕
        </button>
        {["Início", "Ebooks", "Sobre", "Contato"].map((item) => (
          <a key={item} href="#" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>{item}</a>
        ))}
        <a href="#" className="btn-primary" style={{ marginTop: 20 }}>Ver Catálogo</a>
      </div>

      {/* Header */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 40px",
        height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: scrolled ? "1px solid #ffffff14" : "1px solid transparent",
        background: scrolled ? "#000000ee" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        transition: "all 0.4s",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span className="playfair" style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.02em" }}>FOCUS</span>
          <span className="dm" style={{ color: "#ffffff44", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" }}>| Conhecimento</span>
        </div>

        <nav className="hide-mobile" style={{ display: "flex", gap: 40, alignItems: "center" }}>
          {["Ebooks", "Sobre", "Contato"].map((item) => (
            <a key={item} href="#" className="nav-link">{item}</a>
          ))}
          <a href="#" className="btn-primary" style={{ padding: "10px 22px", fontSize: 12 }}>Explorar</a>
        </nav>

        <button
          className="show-mobile"
          onClick={() => setMenuOpen(true)}
          style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", flexDirection: "column", gap: 5 }}
        >
          {[0,1,2].map(i => <span key={i} style={{ display: "block", width: 24, height: 1, background: "#fff" }} />)}
        </button>
      </header>

      {/* Hero */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "100px 40px 80px", position: "relative", overflow: "hidden" }}>
        {/* Decorative vertical lines */}
        <div className="line-accent" style={{ height: "60%", left: "50%", top: "20%" }} />

        {/* Background circle */}
        <div style={{
          position: "absolute", right: "5%", top: "50%", transform: "translate(0, -50%)",
          width: "clamp(300px, 45vw, 600px)", height: "clamp(300px, 45vw, 600px)",
          borderRadius: "50%", border: "1px solid #ffffff08",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", right: "5%", top: "50%", transform: "translate(10%, -50%)",
          width: "clamp(200px, 30vw, 400px)", height: "clamp(200px, 30vw, 400px)",
          borderRadius: "50%", border: "1px solid #ffffff05",
          pointerEvents: "none",
        }} />

        <div ref={heroRef.ref} style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative" }}>
          <div className={`fade-up d1${heroRef.inView ? " in" : ""}`} style={{ marginBottom: 24 }}>
            <span className="dm" style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "#ffffff55", borderLeft: "2px solid #fff4", paddingLeft: 14 }}>
              Plataforma de Conhecimento
            </span>
          </div>

          <h1 className={`playfair fade-up d2${heroRef.inView ? " in" : ""}`} style={{
            fontSize: "clamp(52px, 9vw, 120px)",
            fontWeight: 900,
            lineHeight: 0.92,
            letterSpacing: "-0.02em",
            maxWidth: 800,
            marginBottom: 32,
          }}>
            Conhecimento<br />
            <em style={{ fontStyle: "italic", color: "#ffffffbb" }}>que transforma.</em>
          </h1>

          <p className={`dm fade-up d3${heroRef.inView ? " in" : ""}`} style={{
            fontSize: "clamp(15px, 1.5vw, 18px)",
            lineHeight: 1.7,
            color: "#ffffff77",
            maxWidth: 460,
            marginBottom: 48,
            fontWeight: 300,
          }}>
            Ebooks cuidadosamente selecionados para quem busca evolução real. Conteúdo direto, profundo e aplicável.
          </p>

          <div className={`fade-up d4${heroRef.inView ? " in" : ""}`} style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="#livros" className="btn-primary">Ver Ebooks</a>
            <a href="#sobre" className="btn-ghost">Saiba mais</a>
          </div>

          {/* Stats */}
          <div className={`fade-up d4${heroRef.inView ? " in" : ""}`} style={{ display: "flex", gap: 40, marginTop: 72, flexWrap: "wrap" }}>
            {[["12+", "Títulos"], ["4.9", "Avaliação"], ["3k+", "Leitores"]].map(([num, label]) => (
              <div key={label} className="stat-item">
                <div className="playfair" style={{ fontSize: 28, fontWeight: 700 }}>{num}</div>
                <div className="dm" style={{ fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", color: "#ffffff44", marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Big decorative number */}
        <div className="hero-number">F</div>
      </section>

      {/* Books Section */}
      <section id="livros" style={{ padding: "100px 40px", borderTop: "1px solid #ffffff0d" }}>
        <div ref={booksRef.ref} style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 64, flexWrap: "wrap", gap: 24 }}>
            <div>
              <div className={`dm fade-up${booksRef.inView ? " in" : ""}`} style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "#ffffff44", marginBottom: 12 }}>
                Catálogo
              </div>
              <h2 className={`playfair fade-up d1${booksRef.inView ? " in" : ""}`} style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 700, lineHeight: 1.1 }}>
                Nossos<br /><em>Títulos</em>
              </h2>
            </div>
            <a href="#" className={`btn-ghost fade-up d2${booksRef.inView ? " in" : ""}`}>Ver todos</a>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
            {books.map((book, i) => (
              <div
                key={book.id}
                className={`book-card fade-up d${i + 1}${booksRef.inView ? " in" : ""}`}
                onClick={() => alert(`Redirecionando para carrinho: ${book.title}`)}
              >
                {book.badge && <span className="book-badge">{book.badge}</span>}

                {/* Book cover placeholder */}
                <div style={{
                  width: "100%",
                  aspectRatio: "3/4",
                  background: `linear-gradient(135deg, #ffffff0a 0%, #ffffff04 100%)`,
                  border: "1px solid #ffffff10",
                  marginBottom: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                }}>
                  <span className="playfair" style={{ fontSize: 48, opacity: 0.12, fontWeight: 900 }}>F</span>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(to top, #0a0a0a, transparent)" }} />
                </div>

                <div className="dm" style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#ffffff44", marginBottom: 8 }}>
                  {book.category}
                </div>
                <h3 className="playfair" style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.25, marginBottom: 16 }}>
                  {book.title}
                </h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="dm" style={{ fontSize: 11, color: "#ffffff44", letterSpacing: "0.05em" }}>{book.pages}</span>
                  <span className="playfair" style={{ fontSize: 18, fontWeight: 700 }}>{book.price}</span>
                </div>

                <button className="btn-primary" style={{ width: "100%", marginTop: 20, textAlign: "center" }}>
                  Adquirir
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "100px 40px", borderTop: "1px solid #ffffff0d", position: "relative", overflow: "hidden" }}>
        {/* Gradient blob */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 60% 60% at 50% 50%, #ffffff07 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div ref={ctaRef.ref} style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div className={`dm fade-up${ctaRef.inView ? " in" : ""}`} style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "#ffffff44", marginBottom: 20 }}>
            Comece Hoje
          </div>
          <h2 className={`playfair fade-up d1${ctaRef.inView ? " in" : ""}`} style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, lineHeight: 1, marginBottom: 24, letterSpacing: "-0.02em" }}>
            Investir em conhecimento<br /><em>é o melhor retorno.</em>
          </h2>
          <p className={`dm fade-up d2${ctaRef.inView ? " in" : ""}`} style={{ fontSize: 16, lineHeight: 1.7, color: "#ffffff66", marginBottom: 48, fontWeight: 300 }}>
            Cada ebook é entregue diretamente no seu e-mail após a compra. Pagamento simples e seguro via Kiwifi.
          </p>
          <div className={`fade-up d3${ctaRef.inView ? " in" : ""}`} style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#livros" className="btn-primary" style={{ fontSize: 13 }}>Explorar catálogo</a>
            <a href="#" className="btn-ghost" style={{ fontSize: 13 }}>Falar com suporte</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "48px 40px", borderTop: "1px solid #ffffff0d" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span className="playfair" style={{ fontSize: 18, fontWeight: 700 }}>FOCUS</span>
            <span className="dm" style={{ color: "#ffffff33", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" }}>| Conhecimento</span>
          </div>
          <div className="dm" style={{ fontSize: 11, color: "#ffffff33", letterSpacing: "0.08em" }}>
            © 2025 Focus Conhecimento. Todos os direitos reservados.
          </div>
          <div style={{ display: "flex", gap: 28 }}>
            {["Termos", "Privacidade", "Contato"].map((item) => (
              <a key={item} href="#" className="dm" style={{ fontSize: 11, color: "#ffffff44", textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = "#ffffff44")}
              >{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;