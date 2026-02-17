import { useState } from "react";

import { NoiseOverlay } from "./components/NoiseOverlay";
import { MobileMenu } from "./components/MobileMenu";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { FeaturesStrip } from "./components/FeaturesStrip";
import { BooksSection } from "./components/BooksSection";
import { CtaSection } from "./components/CtaSection";
import { Footer } from "./components/Footer";

export default function App() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap"
      />

      <div className="bg-black text-white min-h-screen overflow-x-hidden scroll-smooth">
        <NoiseOverlay />
        <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <main>
          <HeroSection />
          <FeaturesStrip />
          <BooksSection />
          <CtaSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
