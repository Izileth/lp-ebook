import { useEffect, useState } from "react";

const SCRAMBLE_PHRASES = [
    "Conhecimento",
    "Liderança",
    "Estratégia",
    "Performance",
    "Disciplina",
];

const CHARS = "ABCDEFGHJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

export function ScrambleText() {
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [displayText, setDisplayText] = useState(SCRAMBLE_PHRASES[0]);
    const [isScrambling, setIsScrambling] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            const next = (phraseIndex + 1) % SCRAMBLE_PHRASES.length;
            scramble(SCRAMBLE_PHRASES[next]);
            setPhraseIndex(next);
        }, 2000);

        return () => clearInterval(interval);
    }, [phraseIndex]);

    const scramble = (targetText: string) => {
        let iteration = 0;
        setIsScrambling(true);

        const interval = setInterval(() => {
            setDisplayText(() =>
                targetText
                    .split("")
                    .map((_, index) => {
                        if (index < iteration) {
                            return targetText[index];
                        }
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    })
                    .join("")
            );

            if (iteration >= targetText.length) {
                clearInterval(interval);
                setIsScrambling(false);
            }

            iteration += 1 / 3;
        }, 30);
    };

    return (
        <span
            className="[font-family:'Playfair_Display',serif] font-black not-italic leading-[0.92] tracking-[-0.02em] text-white/80 inline-block"
            style={{
                fontSize: "clamp(52px,9vw,120px)",
                // Subtle flicker tint while scrambling, to signal "noise"
                color: isScrambling ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.80)",
                transition: "color 0.15s ease",
                // Prevent layout shift when shorter/longer phrases cycle
                minWidth: "max-content",
            }}
        >
            {displayText}
        </span>
    );
}