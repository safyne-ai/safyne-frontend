import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useTheme } from "@/hooks/use-theme";

/**
 * Post-hero “Bento” — AI Startup Website UI Kit
 * https://www.figma.com/design/f0ZCnin5svWEUYpT9fp7C0/AI-Startup-Website-UI-Kit-%E2%80%94-Framer-Website-Kit--Community-?node-id=33-2115
 */
type BentoCardContent = {
  kickerTitle: string;
  kickerBody: string;
  visual: "torus" | "dashboard" | "reports" | "cone";
  wide?: boolean;
};

const cards: BentoCardContent[] = [
  {
    kickerTitle: "Intent-aware routing",
    kickerBody:
      "We read your task and send it to the engine that fits—without juggling providers or guesswork.",
    visual: "torus" as const,
  },
  {
    kickerTitle: "One calm workspace",
    kickerBody:
      "Chat, route, and compare models from a single dashboard—built for speed and clarity.",
    visual: "dashboard" as const,
    wide: true,
  },
  {
    kickerTitle: "Transparent usage",
    kickerBody: "See spend, latency, and model mix at a glance—no spreadsheet archaeology.",
    visual: "reports" as const,
    wide: true,
  },
  {
    kickerTitle: "Resilient hand-offs",
    kickerBody: "Automatic fallbacks keep answers flowing when an API hiccups or a model stalls.",
    visual: "cone" as const,
  },
];

const PostHeroBentoSection = () => {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const ease = [0.22, 1, 0.36, 1] as const;
  const transitionSlow = { duration: 0.65, ease };
  const itemHidden = reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 };
  const itemShow = (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { ...transitionSlow, delay: reduceMotion ? 0 : 0.06 * i },
  });

  const sectionBg = isLight
    ? "linear-gradient(180deg, rgba(250,248,255,0.92) 0%, rgba(255,255,255,0.96) 40%, rgba(250,248,255,1) 100%)"
    : "#000000";

  const smallShell = isLight
    ? "border border-violet-200/90 bg-white/90 shadow-[0_12px_44px_-24px_rgba(91,33,182,0.22)] hover:border-violet-300/95 hover:shadow-[0_20px_56px_-28px_rgba(91,33,182,0.28)]"
    : "border border-[rgba(255,255,255,0.15)] bg-[rgba(0,0,0,0.06)] hover:border-[rgba(167,139,250,0.4)] hover:shadow-[0_0_0_1px_rgba(167,139,250,0.12),0_24px_80px_-40px_rgba(88,28,135,0.55)]";

  const wideShell = isLight
    ? "border border-violet-200/70 shadow-[0_16px_56px_-32px_rgba(91,33,182,0.2)] hover:border-violet-300/90 hover:shadow-[0_24px_72px_-36px_rgba(91,33,182,0.28)]"
    : "border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.14)]";

  const wideGradient = isLight
    ? "linear-gradient(179.88deg, rgba(254,252,255,0) 29.33%, rgb(237, 231, 255) 89.04%), linear-gradient(to bottom, #ffffff 0%, #f4efff 55%, #ebe4fb 100%)"
    : "linear-gradient(179.88deg, rgba(3, 1, 6, 0) 29.33%, rgb(54, 23, 100) 89.04%), linear-gradient(to bottom, #000000 0%, #1a0b2e 100%)";

  const titleClass = isLight ? "text-slate-900" : "text-white";
  const cardTitleClass = isLight ? "text-slate-900" : "text-white";
  const cardBodyClass = isLight ? "text-slate-600" : "text-[rgba(255,255,255,0.7)]";

  return (
    <section
      ref={ref}
      id="bento"
      className="relative transition-[background-color] duration-500"
      style={{ background: sectionBg }}
    >
      <div className="mx-auto max-w-[1100px] px-4 py-[clamp(3.5rem,10vw,5rem)] sm:px-6 md:px-[min(50px,4vw)] lg:px-[50px] lg:py-20">
        <motion.div
          className="flex flex-col items-center gap-[31px]"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
          }}
        >
          <motion.h2
            variants={{ hidden: itemHidden, visible: itemShow(0) }}
            className={`max-w-[553px] text-center font-['Inter',sans-serif] text-[clamp(1.5rem,4.2vw,2rem)] font-medium leading-[clamp(2rem,5vw,2.375rem)] tracking-[-0.0128em] text-balance md:text-[32px] md:leading-[38px] ${titleClass}`}
          >
            Harness the power of modern models—routing, spend, and answers that stay intuitive at every
            skill level.
          </motion.h2>

          {/* Row 1 — small + wide (Figma Bento1) */}
          <motion.div
            variants={{ hidden: itemHidden, visible: itemShow(1) }}
            className="flex w-full flex-col gap-2.5 lg:flex-row lg:items-start"
          >
            <BentoSmallCard
              card={cards[0]}
              smallShell={smallShell}
              isLight={isLight}
              cardTitleClass={cardTitleClass}
              cardBodyClass={cardBodyClass}
              reduceMotion={!!reduceMotion}
            />
            <BentoWideCard
              card={cards[1]}
              isLight={isLight}
              wideShell={wideShell}
              wideGradient={wideGradient}
              cardTitleClass={cardTitleClass}
              cardBodyClass={cardBodyClass}
              reduceMotion={!!reduceMotion}
            />
          </motion.div>

          {/* Row 2 — wide + small (Figma Bento2) */}
          <motion.div
            variants={{ hidden: itemHidden, visible: itemShow(2) }}
            className="flex w-full flex-col gap-2.5 lg:flex-row lg:items-start"
          >
            <BentoWideCard
              card={cards[2]}
              isLight={isLight}
              wideShell={wideShell}
              wideGradient={wideGradient}
              cardTitleClass={cardTitleClass}
              cardBodyClass={cardBodyClass}
              reduceMotion={!!reduceMotion}
            />
            <BentoSmallCard
              card={cards[3]}
              smallShell={smallShell}
              isLight={isLight}
              cardTitleClass={cardTitleClass}
              cardBodyClass={cardBodyClass}
              reduceMotion={!!reduceMotion}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

function BentoSmallCard({
  card,
  smallShell,
  isLight,
  cardTitleClass,
  cardBodyClass,
  reduceMotion,
}: {
  card: BentoCardContent;
  smallShell: string;
  isLight: boolean;
  cardTitleClass: string;
  cardBodyClass: string;
  reduceMotion: boolean;
}) {
  return (
    <motion.article
      whileHover={reduceMotion ? undefined : { y: -4, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
      className={`relative h-[min(400px,70vh)] w-full shrink-0 overflow-hidden rounded-[10px] transition-all duration-500 ease-out lg:h-[400px] lg:w-[346px] ${smallShell}`}
    >
      <div className="pointer-events-none absolute inset-x-5 top-5 h-[210px] overflow-hidden rounded-[14px]" aria-hidden>
        <BentoVisual visual={card.visual} isLight={isLight} wide={false} reduceMotion={reduceMotion} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-[clamp(1.5rem,4vw,1.75rem)] pt-20 lg:px-10 lg:pb-7">
        <h3
          className={`font-['Inter',sans-serif] text-base font-medium leading-[31px] tracking-[-0.01em] ${cardTitleClass}`}
        >
          {card.kickerTitle}
        </h3>
        <p
          className={`mt-2 max-w-[259px] font-['Inter',sans-serif] text-base font-normal leading-[26px] tracking-[-0.01em] lg:mt-[27px] ${cardBodyClass}`}
        >
          {card.kickerBody}
        </p>
      </div>
    </motion.article>
  );
}

function BentoWideCard({
  card,
  isLight,
  wideShell,
  wideGradient,
  cardTitleClass,
  cardBodyClass,
  reduceMotion,
}: {
  card: BentoCardContent;
  isLight: boolean;
  wideShell: string;
  wideGradient: string;
  cardTitleClass: string;
  cardBodyClass: string;
  reduceMotion: boolean;
}) {
  return (
    <motion.article
      whileHover={reduceMotion ? undefined : { y: -4, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
      className={`relative h-[min(400px,78vh)] w-full flex-1 overflow-hidden rounded-[10px] transition-all duration-500 ease-out lg:h-[400px] lg:min-w-0 ${wideShell}`}
      style={{ background: wideGradient }}
    >
      <div className="pointer-events-none absolute inset-x-5 top-5 h-[235px] overflow-hidden rounded-[16px] lg:inset-x-8 lg:top-8 lg:h-[230px]" aria-hidden>
        <BentoVisual visual={card.visual} isLight={isLight} wide reduceMotion={reduceMotion} />
      </div>
      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-[clamp(1.5rem,4vw,1.75rem)] lg:px-10 lg:pb-7">
        <h3
          className={`font-['Inter',sans-serif] text-base font-medium leading-[31px] tracking-[-0.01em] ${cardTitleClass}`}
        >
          {card.kickerTitle}
        </h3>
        <p
          className={`mt-2 max-w-[259px] font-['Inter',sans-serif] text-base font-normal leading-[26px] tracking-[-0.01em] lg:mt-[27px] ${cardBodyClass}`}
        >
          {card.kickerBody}
        </p>
      </div>
    </motion.article>
  );
}

function BentoVisual({
  visual,
  isLight,
  wide,
  reduceMotion,
}: {
  visual: BentoCardContent["visual"];
  isLight: boolean;
  wide: boolean;
  reduceMotion: boolean;
}) {
  const shell = isLight
    ? "border-violet-200/80 bg-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
    : "border-white/10 bg-white/[0.035] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]";
  const grid = isLight ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.08)";
  const textMuted = isLight ? "text-slate-500" : "text-white/55";
  const textStrong = isLight ? "text-slate-800" : "text-white/85";
  const accent = isLight ? "bg-violet-600" : "bg-[#9855FF]";
  const panel = isLight ? "border-violet-200/70 bg-white/75" : "border-white/10 bg-black/20";

  return (
    <div className={`relative size-full overflow-hidden rounded-[inherit] border ${shell}`}>
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage: `linear-gradient(${grid} 1px, transparent 1px), linear-gradient(90deg, ${grid} 1px, transparent 1px)`,
          backgroundSize: "34px 34px",
        }}
      />
      <div
        className={`absolute -right-16 -top-20 h-56 w-56 rounded-full blur-3xl ${
          isLight ? "bg-violet-300/45" : "bg-[#9855FF]/25"
        }`}
      />
      <div
        className={`absolute -bottom-24 left-10 h-56 w-56 rounded-full blur-3xl ${
          isLight ? "bg-fuchsia-200/60" : "bg-purple-700/35"
        }`}
      />

      {visual === "dashboard" && (
        <div className="relative z-10 flex h-full gap-3 p-4">
          <div className={`hidden w-24 rounded-2xl border p-3 sm:block ${panel}`}>
            <div className={`mb-4 h-2 w-12 rounded-full ${accent}`} />
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className={`mb-3 h-2 rounded-full ${isLight ? "bg-violet-100" : "bg-white/10"}`} />
            ))}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className={`rounded-2xl border p-3 ${panel}`}>
              <div className={`mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] ${textMuted}`}>
                Workspace
              </div>
              <div className="flex items-end gap-2">
                {[38, 62, 45, 78, 56].map((height, index) => (
                  <span
                    key={index}
                    className={`w-full rounded-t-lg ${accent} ${reduceMotion ? "" : "landing-bento-visual-drift"}`}
                    style={{ height, animationDelay: `${index * 0.16}s`, opacity: 0.45 + index * 0.08 }}
                  />
                ))}
              </div>
            </div>
            <div className={`grid flex-1 grid-cols-2 gap-3 text-[11px] ${textStrong}`}>
              <div className={`rounded-2xl border p-3 ${panel}`}>GPT route ready</div>
              <div className={`rounded-2xl border p-3 ${panel}`}>Cost guard on</div>
            </div>
          </div>
        </div>
      )}

      {visual === "reports" && (
        <div className="relative z-10 grid h-full grid-cols-[1.15fr_0.85fr] gap-3 p-4">
          <div className={`flex flex-col justify-between rounded-2xl border p-4 ${panel}`}>
            <div>
              <div className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${textMuted}`}>Usage mix</div>
              <div className={`mt-2 text-2xl font-semibold ${textStrong}`}>42k</div>
            </div>
            <div className="flex items-end gap-2">
              {[35, 88, 52, 72, 48, 96].map((height, index) => (
                <span
                  key={index}
                  className={`w-full rounded-t-md ${index % 2 ? accent : isLight ? "bg-violet-300" : "bg-white/25"}`}
                  style={{ height }}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {["Latency", "Spend", "Models"].map((label, index) => (
              <div key={label} className={`flex-1 rounded-2xl border p-3 ${panel}`}>
                <div className={`text-[10px] uppercase tracking-[0.14em] ${textMuted}`}>{label}</div>
                <div className={`mt-3 h-2 rounded-full ${isLight ? "bg-violet-100" : "bg-white/10"}`}>
                  <div className={`h-full rounded-full ${accent}`} style={{ width: `${72 - index * 14}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {visual === "torus" && (
        <div className="relative z-10 flex h-full items-center justify-center">
          <div className={`absolute h-28 w-28 rounded-full border ${isLight ? "border-violet-200" : "border-white/10"}`} />
          <div
            className={`absolute h-20 w-20 rounded-full border-[14px] ${
              isLight ? "border-violet-500/80 shadow-[0_0_50px_rgba(139,92,246,0.28)]" : "border-[#9855FF]/75 shadow-[0_0_60px_rgba(152,85,255,0.45)]"
            } ${reduceMotion ? "" : "landing-bento-visual-drift"}`}
          />
          {["Prompt", "GPT", "Gemini", "Kimi"].map((label, index) => (
            <span
              key={label}
              className={`absolute rounded-full border px-3 py-1 text-[11px] font-medium ${panel} ${textStrong}`}
              style={{
                transform: `translate(${[0, 84, -82, 0][index]}px, ${[-72, 8, 8, 74][index]}px)`,
              }}
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {visual === "cone" && (
        <div className="relative z-10 flex h-full items-center justify-center p-5">
          <div className={`absolute h-28 w-28 rotate-45 rounded-[28px] ${isLight ? "bg-violet-200/80" : "bg-[#9855FF]/20"}`} />
          <div className={`relative w-full max-w-[230px] rounded-3xl border p-4 ${panel}`}>
            <div className={`mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] ${textMuted}`}>Fallback chain</div>
            {["Primary model", "Backup route", "Answer delivered"].map((label, index) => (
              <div key={label} className="flex items-center gap-3">
                <span className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] text-white ${accent}`}>
                  {index + 1}
                </span>
                <span className={`text-sm ${textStrong}`}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        className="absolute inset-x-0 bottom-0 h-24"
        style={{
          background: isLight
            ? "linear-gradient(180deg, rgba(255,255,255,0), rgba(237,231,255,0.96))"
            : "linear-gradient(180deg, rgba(0,0,0,0), rgba(54,23,100,0.92))",
        }}
      />
    </div>
  );
}

export default PostHeroBentoSection;
