import { NoiseOverlay } from "../NoiseOverlay";

export function BookBackground() {
  return (
    <>
      <NoiseOverlay />
      <div
        aria-hidden="true"
        className="fixed left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/[0.06] to-transparent pointer-events-none"
      />
    </>
  );
}
