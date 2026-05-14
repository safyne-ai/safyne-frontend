import type { RefObject } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion, useSpring, useMotionValue } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "@/hooks/use-theme";

/** Figma kit: “Clients” frame + CTA plate (no email field — animated CTA copy only). */
const FIGMA_CLIENTS = "https://www.figma.com/design/f0ZCnin5svWEUYpT9fp7C0/AI-Startup-Website-UI-Kit-%E2%80%94-Framer-Website-Kit--Community-?node-id=33-2118";
const FIGMA_CTA_SECTION = "https://www.figma.com/design/f0ZCnin5svWEUYpT9fp7C0/AI-Startup-Website-UI-Kit-%E2%80%94-Framer-Website-Kit--Community-?node-id=22-377";

/** CTA Section assets (`22:377`) — MCP URLs; refresh from Figma if expired. */
const ctaGridTexture = "https://www.figma.com/api/mcp/asset/b1803d50-561e-4178-a4b6-6fd10eb8586c";
const ctaEllipseGlow = "https://www.figma.com/api/mcp/asset/ac93a299-f91d-4462-97e8-8948db79b911";

const leaders = [
  {
    name: "Keshav Rana",
    roleLabel: "Founder",
    quote:
      "Safyne is where raw computational power meets absolute financial precision—we don't just route your AI; we protect your vision and your margins.",
    initials: "KR",
  },
  {
    name: "Kapil Sharma",
    roleLabel: "CEO",
    quote:
      "While others burn capital on raw power, we've perfected the logic that turns every millisecond of AI into pure, scalable profit.",
    initials: "KS",
  },
] as const;

function useSlideFocus(scrollerRef: RefObject<HTMLDivElement | null>, slideCount: number) {
  const [focus, setFocus] = useState<number[]>(() => Array(slideCount).fill(0));

  const sync = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const w = el.clientWidth;
    if (w <= 0) return;
    const t = el.scrollLeft / w;
    const next = Array.from({ length: slideCount }, (_, i) => {
      const dist = Math.abs(t - i);
      return Math.max(0, Math.min(1, 1 - dist * 1.35));
    });
    setFocus(next);
  }, [slideCount]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      ro.disconnect();
    };
  }, [sync]);

  return focus;
}

const ctaTaglines = [
  "Route once. Spend smart. Scale calmly.",
  "One ledger for every model you run.",
  "Margins stay legible—even when traffic spikes.",
] as const;

function AnimatedLeadershipCta({ reduceMotion, isLight }: { reduceMotion: boolean; isLight: boolean }) {
  const [line, setLine] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setLine((i) => (i + 1) % ctaTaglines.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  const subCls = isLight ? "text-slate-600" : "text-[rgba(255,255,255,0.55)]";
  const grad = isLight
    ? "linear-gradient(105deg, rgb(15,23,42) 0%, rgb(91, 33, 182) 45%, rgb(124, 58, 237) 55%, rgb(15,23,42) 100%)"
    : "linear-gradient(105deg, rgba(255,255,255,0.92) 0%, rgb(196,181,253) 45%, rgb(167,139,250) 55%, rgba(255,255,255,0.92) 100%)";

  return (
    <div className="flex w-full max-w-[640px] flex-col items-center gap-3 px-1 text-center sm:px-2" data-name="Animated CTA (content)">
      <div className="relative min-h-[4.5rem] w-full sm:min-h-[5rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={reduceMotion ? 0 : line}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className={`${reduceMotion ? "" : "leadership-cta-gradient-flow"} absolute inset-x-0 top-0 bg-[length:220%_auto] bg-clip-text font-['Inter',sans-serif] text-[clamp(1.125rem,3.2vw,1.625rem)] font-semibold leading-[1.35] tracking-[-0.02em] text-transparent`}
            style={{ backgroundImage: grad }}
          >
            {ctaTaglines[reduceMotion ? 0 : line]}
          </motion.p>
        </AnimatePresence>
      </div>
      <motion.p
        className={`max-w-[401px] font-['Inter',sans-serif] text-[15px] font-normal leading-[26px] tracking-[-0.01em] ${subCls}`}
        animate={reduceMotion ? {} : { opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        The same precision we bring to routing—we bring to how this story is told.
      </motion.p>
    </div>
  );
}

function LeadershipCtaPlate({ isLight, reduceMotion }: { isLight: boolean; reduceMotion: boolean }) {
  const baseBg = isLight
    ? "linear-gradient(165deg, rgba(250,248,255,1) 0%, rgba(237,233,254,0.97) 52%, rgba(221,214,254,0.94) 100%)"
    : "#020103";

  const gradOverlay = isLight
    ? "linear-gradient(180.07deg, rgba(250, 248, 255, 0) 15.64%, rgba(250, 248, 255, 0.96) 99.86%)"
    : "linear-gradient(180.07deg, rgba(2, 1, 3, 0) 15.64%, rgb(2, 1, 3) 99.86%)";

  const deckCls = isLight ? "text-slate-600" : "text-[rgba(255,255,255,0.78)]";

  const topViolet = isLight
    ? "radial-gradient(ellipse 82% 100% at 50% 0%, rgba(124, 58, 237, 0.28), transparent 62%)"
    : "radial-gradient(ellipse 82% 100% at 50% 0%, rgba(140, 69, 255, 0.62), rgba(109, 40, 217, 0.22) 38%, transparent 68%)";

  return (
    <div className="mx-auto mt-12 w-full max-w-[1100px] md:mt-16" data-figma-ref={FIGMA_CTA_SECTION}>
      <div
        className="relative mx-auto h-[473px] w-full overflow-hidden rounded-[15px]"
        style={{ background: baseBg }}
        data-node-id="22:377"
      >
        {/* Grid texture — matches `22:378` layer */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[15px] opacity-[0.1]">
          <img
            alt=""
            className="absolute left-[-8.85%] top-[-3.52%] h-[210.49%] max-w-none w-[122.1%] object-cover"
            src={ctaGridTexture}
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Upper rim light — violet band between top edge and content (kit atmosphere) */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 z-[1] h-[min(220px,46%)] w-[min(960px,96%)] -translate-x-1/2 rounded-t-[15px]"
          style={{ backgroundImage: topViolet }}
          aria-hidden
        />

        {/* Ellipse glow — matches `22:374` */}
        <div className="pointer-events-none absolute left-1/2 top-[-326px] z-[1] h-[622px] w-[min(686px,140%)] max-w-[686px] -translate-x-1/2 translate-x-[9px] sm:translate-x-[9px]">
          <img alt="" className="block size-full max-w-none object-contain" src={ctaEllipseGlow} loading="lazy" decoding="async" />
        </div>

        {/* Bottom fade — matches `22:379` */}
        <div
          className="pointer-events-none absolute inset-0 z-[2] rounded-[15px]"
          style={{ backgroundImage: gradOverlay }}
        />

        <div className="relative z-[3] flex h-full flex-col items-center px-5 pb-10 pt-10 text-center md:px-9 md:pt-[52px]">
          <h2
            className={`max-w-[720px] bg-gradient-to-b bg-clip-text font-['Inter',sans-serif] text-[clamp(1.5rem,4.2vw,2.5rem)] font-medium leading-[1.15] tracking-[-0.03em] text-transparent md:leading-[1.12] ${
              isLight ? "from-slate-900 from-[40%] to-violet-700" : "from-white from-[42%] to-[#c4b5fd]"
            }`}
          >
            One platform. Every frontier model.
          </h2>
          <p
            className={`mt-3 max-w-[544px] font-['Inter',sans-serif] text-[17px] font-normal leading-[28px] tracking-[-0.01em] md:text-[20px] md:leading-[31px] ${deckCls}`}
          >
            Stop juggling keys and surprise bills—route prompts, watch credits, and keep finance and developers aligned from a
            single Safyne workspace.
          </p>

          <div className="mt-auto flex w-full flex-1 flex-col items-center justify-end pt-8 md:pt-6">
            <AnimatedLeadershipCta reduceMotion={reduceMotion} isLight={isLight} />
          </div>
        </div>
      </div>
    </div>
  );
}

const LeadershipCarouselSection = () => {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });
  const [active, setActive] = useState(0);
  const slideFocus = useSlideFocus(scrollerRef, leaders.length);

  const dragRef = useRef({ active: false, startX: 0, startScroll: 0, moved: false });

  const syncActive = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const w = el.clientWidth;
    if (w <= 0) return;
    const i = Math.round(el.scrollLeft / w);
    setActive(Math.max(0, Math.min(i, leaders.length - 1)));
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    syncActive();
    el.addEventListener("scroll", syncActive, { passive: true });
    const ro = new ResizeObserver(syncActive);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", syncActive);
      ro.disconnect();
    };
  }, [syncActive]);

  const scrollToIndex = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const el = scrollerRef.current;
    if (!el) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: false,
    };
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const el = scrollerRef.current;
    if (!el) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 4) dragRef.current.moved = true;
    el.scrollLeft = dragRef.current.startScroll - dx;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const el = scrollerRef.current;
    if (el?.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    dragRef.current.active = false;
  };

  const shellBg = isLight
    ? "linear-gradient(180deg, #faf8ff 0%, #f1ecff 50%, #e8e0fc 100%)"
    : "#000000";

  const borderCls = isLight ? "border-violet-200/70" : "border-[rgba(255,255,255,0.12)]";

  const h2Cls = isLight ? "text-slate-900" : "text-white";
  const leadCls = isLight ? "text-slate-600" : "text-white/85";
  const quoteCls = isLight ? "text-slate-900" : "text-white";
  const nameCls = isLight ? "text-slate-900" : "text-white";
  const metaCls = isLight ? "text-slate-500" : "text-[rgba(255,255,255,0.7)]";

  const lineColor = isLight ? "rgba(124, 58, 237, 0.55)" : "rgba(167, 139, 250, 0.45)";
  const lineGlow = isLight ? "rgba(139, 92, 246, 0.35)" : "rgba(139, 92, 246, 0.5)";

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section
      ref={sectionRef}
      id="leadership"
      data-figma-clients={FIGMA_CLIENTS}
      className={`relative border-t border-solid ${borderCls} transition-colors duration-500`}
      style={{ background: shellBg }}
    >
      <div className="mx-auto max-w-[1200px] px-5 py-[clamp(3rem,10vw,4.875rem)] sm:px-8 md:px-[min(90px,8vw)] md:py-[78px]">
        <motion.div
          className="flex flex-col items-center gap-7 text-center md:gap-7"
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.55, ease }}
        >
          <h2
            className={`max-w-[340px] font-['Inter',sans-serif] text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1.16] tracking-[-0.015em] md:text-[56px] md:leading-[65px] ${h2Cls}`}
          >
            Founder &amp; CEO
          </h2>
          <p
            className={`max-w-[433px] font-['Inter',sans-serif] text-[18px] font-normal leading-[30px] tracking-[-0.01em] md:text-[20px] md:leading-[31px] ${leadCls}`}
          >
            Drag, swipe, or scroll—one leader fills the frame at a time.
          </p>
        </motion.div>

        <div className="relative mt-10 md:mt-12">
          <div
            ref={scrollerRef}
            className="landing-hide-scrollbar flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth px-0 pb-2 select-none md:select-auto md:px-0"
            style={{
              cursor: reduceMotion ? "default" : "grab",
              touchAction: "pan-x pinch-zoom",
            }}
            tabIndex={0}
            aria-label="Leadership carousel — drag horizontally to change slide"
            onPointerDown={reduceMotion ? undefined : onPointerDown}
            onPointerMove={reduceMotion ? undefined : onPointerMove}
            onPointerUp={reduceMotion ? undefined : onPointerUp}
            onPointerCancel={reduceMotion ? undefined : onPointerUp}
            onPointerDownCapture={() => {
              if (!reduceMotion) {
                const el = scrollerRef.current;
                if (el) el.style.cursor = "grabbing";
              }
            }}
            onPointerUpCapture={() => {
              const el = scrollerRef.current;
              if (el && !reduceMotion) el.style.cursor = "grab";
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") {
                e.preventDefault();
                scrollToIndex(Math.min(active + 1, leaders.length - 1));
              } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                scrollToIndex(Math.max(active - 1, 0));
              }
            }}
          >
            {leaders.map((person, slideIndex) => {
              const f = slideFocus[slideIndex] ?? 0;
              return (
                <div
                  key={person.name}
                  className="w-full min-w-full shrink-0 snap-center snap-always px-1 md:px-2"
                  aria-hidden={active !== slideIndex}
                >
                  <SlideCard
                    person={person}
                    focus={f}
                    isLight={isLight}
                    reduceMotion={!!reduceMotion}
                    lineColor={lineColor}
                    lineGlow={lineGlow}
                    quoteCls={quoteCls}
                    nameCls={nameCls}
                    metaCls={metaCls}
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-center gap-2 md:mt-10" role="tablist" aria-label="Select leader">
            {leaders.map((person, i) => (
              <button
                key={person.name}
                type="button"
                role="tab"
                aria-selected={active === i}
                aria-label={`Show ${person.name}`}
                className={`h-2 rounded-full transition-[width,background-color] duration-500 ease-out ${active === i ? "w-8 bg-violet-500" : `w-2 ${isLight ? "bg-violet-300/80" : "bg-white/25"}`}`}
                onClick={() => scrollToIndex(i)}
              />
            ))}
          </div>
        </div>

        <LeadershipCtaPlate isLight={isLight} reduceMotion={!!reduceMotion} />
      </div>
    </section>
  );
};

function SlideCard({
  person,
  focus,
  isLight,
  reduceMotion,
  lineColor,
  lineGlow,
  quoteCls,
  nameCls,
  metaCls,
}: {
  person: (typeof leaders)[number];
  focus: number;
  isLight: boolean;
  reduceMotion: boolean;
  lineColor: string;
  lineGlow: string;
  quoteCls: string;
  nameCls: string;
  metaCls: string;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 280, damping: 28 });
  const ry = useSpring(useMotionValue(0), { stiffness: 280, damping: 28 });

  const onMouseMove = (e: React.MouseEvent) => {
    if (reduceMotion) return;
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * -9);
    rx.set(py * 7);
  };

  const onMouseLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  const scale = 0.94 + 0.06 * focus;
  const contentY = (1 - focus) * 14;
  const fade = 0.72 + 0.28 * focus;

  return (
    <motion.div
      ref={cardRef}
      className="relative mx-auto max-w-[990px]"
      animate={reduceMotion ? {} : { scale, y: contentY, opacity: fade }}
      transition={{ type: "spring", stiffness: 220, damping: 32, mass: 0.9 }}
    >
      <div className="relative [perspective:1100px]">
        <motion.div
          className="relative [transform-style:preserve-3d]"
          style={{ rotateX: rx, rotateY: ry }}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
        >
          <div className="relative flex min-h-[min(440px,82vw)] flex-col items-center justify-center gap-10 lg:min-h-[401px] lg:flex-row lg:items-center lg:gap-12 lg:px-4">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[min(300px,58vw)] w-[min(360px,88vw)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-[56px] md:h-[340px] md:w-[420px]"
          style={{ background: isLight ? "rgba(167, 139, 250, 0.35)" : "rgba(109, 40, 217, 0.4)" }}
          aria-hidden
        />

        {/* Kit-style frame: lines hugging the portrait + horizontal rails */}
        <div className="pointer-events-none absolute inset-[2%] md:inset-[4%]" aria-hidden>
          <svg className="size-full overflow-visible" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lead-h" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={lineGlow} stopOpacity="0" />
                <stop offset="45%" stopColor={lineColor} stopOpacity="1" />
                <stop offset="100%" stopColor={lineGlow} stopOpacity="0" />
              </linearGradient>
              <linearGradient id="lead-v" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={lineGlow} stopOpacity="0" />
                <stop offset="50%" stopColor={lineColor} stopOpacity="1" />
                <stop offset="100%" stopColor={lineGlow} stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Top / bottom full rails */}
            <line x1="6%" y1="12%" x2="94%" y2="12%" stroke="url(#lead-h)" strokeWidth="1" strokeLinecap="round" />
            <line x1="6%" y1="88%" x2="94%" y2="88%" stroke="url(#lead-h)" strokeWidth="1" strokeLinecap="round" />
            {/* Verticals — bracket portrait band */}
            <line x1="14%" y1="8%" x2="14%" y2="92%" stroke="url(#lead-v)" strokeWidth="1" strokeLinecap="round" />
            <line x1="86%" y1="8%" x2="86%" y2="92%" stroke="url(#lead-v)" strokeWidth="1" strokeLinecap="round" />
            {/* Short cross segments near portrait center (desktop) */}
            <line x1="38%" y1="22%" x2="62%" y2="22%" stroke={lineColor} strokeOpacity="0.55" strokeWidth="1" />
            <line x1="38%" y1="78%" x2="62%" y2="78%" stroke={lineColor} strokeOpacity="0.55" strokeWidth="1" />
          </svg>
        </div>

        <motion.div
          className="relative z-10 w-full max-w-[320px] shrink-0 lg:w-[38%]"
          style={{ translateZ: reduceMotion ? 0 : 28 }}
        >
          {/* Corner brackets tight on photo */}
          <div className="relative p-3">
            <span
              className="pointer-events-none absolute left-0 top-0 h-10 w-10 rounded-tl-[20px] border-l-2 border-t-2 transition-opacity duration-300"
              style={{ borderColor: lineColor, boxShadow: `-2px -2px 18px ${lineGlow}` }}
            />
            <span
              className="pointer-events-none absolute right-0 top-0 h-10 w-10 rounded-tr-[20px] border-r-2 border-t-2 transition-opacity duration-300"
              style={{ borderColor: lineColor, boxShadow: `2px -2px 18px ${lineGlow}` }}
            />
            <span
              className="pointer-events-none absolute bottom-0 left-0 h-10 w-10 rounded-bl-[20px] border-b-2 border-l-2 transition-opacity duration-300"
              style={{ borderColor: lineColor, boxShadow: `-2px 2px 18px ${lineGlow}` }}
            />
            <span
              className="pointer-events-none absolute bottom-0 right-0 h-10 w-10 rounded-br-[20px] border-b-2 border-r-2 transition-opacity duration-300"
              style={{ borderColor: lineColor, boxShadow: `2px 2px 18px ${lineGlow}` }}
            />

            <div
              className={`group relative aspect-[4/5] w-full overflow-hidden rounded-[20px] shadow-[0_28px_90px_-36px_rgba(88,28,135,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] ring-1 transition-[transform,box-shadow] duration-500 ease-out group-hover:shadow-[0_36px_100px_-34px_rgba(124,58,237,0.45)] ${isLight ? "ring-violet-300/90" : "ring-white/12"}`}
            >
              <div
                className={`flex size-full items-center justify-center font-['Inter',sans-serif] text-4xl font-semibold tracking-tight transition-transform duration-500 ${isLight ? "bg-gradient-to-br from-violet-200 via-violet-100 to-white text-violet-800" : "bg-gradient-to-br from-[#3d2066] via-[#2a1544] to-[#12061f] text-white/90"}`}
              >
                {person.initials}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="relative z-10 flex max-w-[480px] flex-col gap-5 text-left lg:w-[52%] lg:max-w-none lg:pl-2"
          style={{ translateZ: reduceMotion ? 0 : 12 }}
          animate={
            reduceMotion
              ? {}
              : {
                  x: (1 - focus) * 12,
                  filter: `blur(${Math.max(0, 1 - focus) * 2}px)`,
                }
          }
          transition={{ type: "spring", stiffness: 200, damping: 28 }}
        >
          <motion.p
            className={`font-['Inter',sans-serif] text-[clamp(1.125rem,3vw,1.4375rem)] font-medium leading-[1.45] tracking-[-0.01em] ${quoteCls}`}
            animate={reduceMotion ? {} : { opacity: 0.55 + 0.45 * focus }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            “{person.quote}”
          </motion.p>
          <motion.div
            className="space-y-1"
            animate={reduceMotion ? {} : { opacity: 0.65 + 0.35 * focus, y: (1 - focus) * 6 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className={`font-['Inter',sans-serif] text-[16px] font-normal leading-[26px] tracking-[-0.01em] ${nameCls}`}>
              {person.name}
            </p>
            <p className={`font-['Inter',sans-serif] text-[14px] font-normal leading-[26px] tracking-[-0.01em] ${metaCls}`}>
              {person.roleLabel} — safyne
            </p>
          </motion.div>
        </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default LeadershipCarouselSection;
