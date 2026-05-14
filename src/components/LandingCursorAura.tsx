import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

type Props = {
  isLight: boolean;
};

/**
 * Fixed purple radial wash that follows the pointer (marketing page only).
 * Disabled for reduced motion and touch-first devices.
 */
const LandingCursorAura = ({ isLight }: Props) => {
  const layerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (reduceMotion || typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setActive(true);
  }, [reduceMotion]);

  useEffect(() => {
    if (!active) return;
    const el = layerRef.current;
    if (!el) return;

    const peak = isLight ? "124, 58, 237, 0.11" : "180, 150, 255, 0.13";
    const apply = (cx: number, cy: number) => {
      el.style.background = `radial-gradient(520px circle at ${cx}px ${cy}px, rgba(${peak}), transparent 52%)`;
    };

    apply(window.innerWidth / 2, window.innerHeight / 2);

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => apply(e.clientX, e.clientY));
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, [active, isLight]);

  useEffect(() => {
    if (!active) return;
    const el = layerRef.current;
    if (!el) return;
    el.style.mixBlendMode = isLight ? "multiply" : "screen";
    el.style.opacity = isLight ? "0.95" : "0.85";
  }, [active, isLight]);

  if (reduceMotion || !active) return null;

  return (
    <div
      ref={layerRef}
      className="pointer-events-none fixed inset-0 z-[12]"
      aria-hidden
    />
  );
};

export default LandingCursorAura;
