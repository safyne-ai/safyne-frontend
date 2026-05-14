import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useTheme } from "@/hooks/use-theme";

/**
 * Post-hero “Bento” — AI Startup Website UI Kit
 * https://www.figma.com/design/f0ZCnin5svWEUYpT9fp7C0/AI-Startup-Website-UI-Kit-%E2%80%94-Framer-Website-Kit--Community-?node-id=33-2115
 */
const imgVisual =
  "https://www.figma.com/api/mcp/asset/1b593c87-6789-435d-9f9b-1d3ab3825b6a";
const imgAppWideMask =
  "https://www.figma.com/api/mcp/asset/0c942d6f-4a53-4202-a3db-7bf7635fb10c";
const imgDashboard =
  "https://www.figma.com/api/mcp/asset/cedd21a3-bcb7-4a1d-880c-4923e011be99";
const imgReports =
  "https://www.figma.com/api/mcp/asset/4ac23543-a8af-41b2-b946-85400593403c";
const imgVisualCone =
  "https://www.figma.com/api/mcp/asset/26a5f270-60d7-4f0c-b776-43e1b54b8109";

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
              cardTitleClass={cardTitleClass}
              cardBodyClass={cardBodyClass}
              imgTorus={imgVisual}
              reduceMotion={!!reduceMotion}
            />
            <BentoWideCard
              card={cards[1]}
              isLight={isLight}
              wideShell={wideShell}
              wideGradient={wideGradient}
              cardTitleClass={cardTitleClass}
              cardBodyClass={cardBodyClass}
              maskUrl={imgAppWideMask}
              imageUrl={imgDashboard}
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
              maskUrl={imgAppWideMask}
              imageUrl={imgReports}
              reduceMotion={!!reduceMotion}
            />
            <BentoSmallCard
              card={cards[3]}
              smallShell={smallShell}
              cardTitleClass={cardTitleClass}
              cardBodyClass={cardBodyClass}
              imgTorus={imgVisualCone}
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
  cardTitleClass,
  cardBodyClass,
  imgTorus,
  reduceMotion,
}: {
  card: BentoCardContent;
  smallShell: string;
  cardTitleClass: string;
  cardBodyClass: string;
  imgTorus: string;
  reduceMotion: boolean;
}) {
  return (
    <motion.article
      whileHover={reduceMotion ? undefined : { y: -4, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
      className={`relative h-[min(400px,70vh)] w-full shrink-0 overflow-hidden rounded-[10px] transition-all duration-500 ease-out lg:h-[400px] lg:w-[346px] ${smallShell}`}
    >
      <div
        className={`pointer-events-none absolute left-1/2 top-[10px] w-[min(234px,65%)] -translate-x-1/2 ${reduceMotion ? "" : "landing-bento-visual-drift"}`}
      >
        <img alt="" src={imgTorus} className="h-auto w-full object-contain" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-[clamp(1.5rem,4vw,1.75rem)] pt-20 lg:px-10 lg:pb-7">
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
  maskUrl,
  imageUrl,
  reduceMotion,
}: {
  card: BentoCardContent;
  isLight: boolean;
  wideShell: string;
  wideGradient: string;
  cardTitleClass: string;
  cardBodyClass: string;
  maskUrl: string;
  imageUrl: string;
  reduceMotion: boolean;
}) {
  return (
    <motion.article
      whileHover={reduceMotion ? undefined : { y: -4, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
      className={`relative h-[min(400px,78vh)] w-full flex-1 overflow-hidden rounded-[10px] transition-all duration-500 ease-out lg:h-[400px] lg:min-w-0 ${wideShell}`}
      style={{ background: wideGradient }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[10px]" aria-hidden>
        {/* Mobile / tablet: full-bleed crop; desktop: Figma mask composite */}
        <div className="absolute inset-0 lg:hidden">
          <img alt="" src={imageUrl} className="size-full object-cover object-top" />
          <div
            className="absolute inset-0"
            style={{
              background: isLight
                ? "linear-gradient(179.88deg, rgba(255,252,255,0) 22%, rgba(237,231,255,0.92) 88%)"
                : "linear-gradient(179.88deg, rgba(3, 1, 6, 0) 22%, rgb(54, 23, 100) 88%)",
            }}
          />
        </div>
        <div
          className={`absolute left-1/2 top-[46px] hidden h-[353px] w-[min(1098px,220%)] -translate-x-[calc(50%-55px)] rounded-lg sm:w-[633px] lg:block ${isLight ? "border border-violet-200/35" : "border border-[rgba(255,255,255,0.1)]"}`}
          style={{
            maskImage: `url('${maskUrl}')`,
            WebkitMaskImage: `url('${maskUrl}')`,
            maskSize: "744px 400px",
            WebkitMaskSize: "744px 400px",
            maskPosition: "-55px -46px",
            WebkitMaskPosition: "-55px -46px",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
          }}
        >
          <img alt="" src={imageUrl} className="size-full rounded-lg object-cover" />
        </div>
        <div
          className="absolute inset-0 hidden rounded-[10px] lg:block"
          style={{
            background: isLight
              ? "linear-gradient(179.88deg, rgba(255,252,255,0) 29.33%, rgba(237,231,255,0.95) 89.04%)"
              : "linear-gradient(179.88deg, rgba(3, 1, 6, 0) 29.33%, rgb(54, 23, 100) 89.04%)",
            maskImage: `url('${maskUrl}')`,
            WebkitMaskImage: `url('${maskUrl}')`,
            maskSize: "744px 400px",
            WebkitMaskSize: "744px 400px",
            maskPosition: "0 0",
            WebkitMaskPosition: "0 0",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
          }}
        />
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

export default PostHeroBentoSection;
