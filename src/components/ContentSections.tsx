import type { LucideIcon } from "lucide-react";
import {
  Wallet,
  Route,
  LineChart,
  Zap,
  Brain,
  Braces,
  Columns2,
  UsersRound,
  BadgePercent,
} from "lucide-react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useTheme } from "@/hooks/use-theme";
import LeadershipCarouselSection from "@/components/LeadershipCarouselSection";

/**
 * Section 1 — AI Startup kit “Features” frame
 * https://www.figma.com/design/f0ZCnin5svWEUYpT9fp7C0/AI-Startup-Website-UI-Kit-%E2%80%94-Framer-Website-Kit--Community-?node-id=33-2116
 * (User link: u7XNQGbYBU5xAjWth5890e — same node in community kit.)
 */

type Feature = { icon: LucideIcon; title: string; body: string };

const featureColumns: [Feature, Feature, Feature][] = [
  [
    {
      icon: Wallet,
      title: "Unified credits",
      body: "Buy once and spend across GPT, Claude, Gemini, and more—without juggling invoices or seat math.",
    },
    {
      icon: Route,
      title: "Intent-aware routing",
      body: "We weight quality, latency, and cost for every prompt, then send it to the engine that fits.",
    },
    {
      icon: LineChart,
      title: "Spend clarity",
      body: "Credits, model mix, and burn—live—so finance and product stay aligned without spreadsheet archaeology.",
    },
  ],
  [
    {
      icon: Zap,
      title: "Fast fallbacks",
      body: "If a provider stalls, your work keeps moving—prompts hand off to backup models in moments.",
    },
    {
      icon: Brain,
      title: "Context that sticks",
      body: "Thread memory that adapts to how you write and work—without re-explaining the basics each time.",
    },
    {
      icon: Braces,
      title: "Predictable APIs",
      body: "One integration shape across providers—fewer edge cases, faster shipping, calmer on-call.",
    },
  ],
  [
    {
      icon: Columns2,
      title: "Side-by-side answers",
      body: "Run the same task on multiple engines in one view—pick the best output without tab gymnastics.",
    },
    {
      icon: UsersRound,
      title: "Team-ready controls",
      body: "Credits, limits, and visibility for squads—not a pile of personal API keys in a shared doc.",
    },
    {
      icon: BadgePercent,
      title: "Margin-safe economics",
      body: "Predictable unit economics so AI stays a lever for the business—not a runaway line item.",
    },
  ],
];

const ProblemFeaturesSection = () => {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const shellBg = isLight
    ? "linear-gradient(118.44deg, rgb(244, 239, 255) 0.54%, rgb(255, 252, 255) 45%, rgb(250, 248, 255) 99.46%)"
    : "linear-gradient(118.44deg, rgb(25, 13, 46) 0.54%, rgb(2, 1, 3) 99.46%)";

  const borderCls = isLight ? "border-violet-200/90" : "border-[rgba(255,255,255,0.15)]";

  const h2Cls = isLight
    ? "text-slate-900"
    : "text-white";

  const titleCls = isLight
    ? "text-slate-900"
    : "text-white";

  const bodyCls = isLight
    ? "text-slate-600"
    : "text-[rgba(255,255,255,0.7)]";

  const iconCls = isLight
    ? "text-violet-700 group-hover:text-violet-800"
    : "text-white/90 group-hover:text-violet-200";

  const itemHidden = reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 };
  const itemShow = (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay: reduceMotion ? 0 : 0.04 * i },
  });

  return (
    <section
      ref={ref}
      id="problem"
      className={`relative border border-solid ${borderCls} transition-colors duration-500`}
      style={{ background: shellBg }}
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-6 py-[clamp(3.5rem,12vw,4.75rem)] sm:px-8 md:px-[50px] md:py-[76px] lg:flex-row lg:items-start lg:gap-[clamp(2.5rem,5vw,3.75rem)] xl:gap-16">
        <motion.div
          className="shrink-0 lg:sticky lg:top-28 lg:max-w-[min(100%,420px)] xl:w-[38%]"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
        >
          <motion.h2
            variants={{ hidden: itemHidden, visible: itemShow(0) }}
            className={`text-balance font-['Inter',sans-serif] text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1.16] tracking-[-0.015em] md:text-[56px] md:leading-[65px] ${h2Cls}`}
          >
            AI should feel simpler as it gets more powerful, not more fragmented.
          </motion.h2>
        </motion.div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-10 md:gap-10 lg:flex-row lg:gap-[60px]">
            {featureColumns.map((col, ci) => (
              <div
                key={ci}
                className="flex min-w-0 flex-1 flex-col gap-10 lg:max-w-[322px]"
              >
                {col.map((f, ri) => {
                  const Icon = f.icon;
                  const idx = ci * 3 + ri + 1;
                  return (
                    <motion.article
                      key={f.title}
                      initial="hidden"
                      animate={inView ? "visible" : "hidden"}
                      variants={{ hidden: itemHidden, visible: itemShow(idx + 1) }}
                      whileHover={
                        reduceMotion
                          ? undefined
                          : { y: -2, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }
                      }
                      className="group flex flex-col gap-2.5"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="flex size-4 shrink-0 items-center justify-center" aria-hidden>
                          <Icon className={`size-4 stroke-[1.75] transition-colors duration-300 ease-out ${iconCls}`} />
                        </span>
                        <h3
                          className={`font-['Inter',sans-serif] text-[16px] font-medium leading-[31px] tracking-[-0.01em] transition-colors duration-300 ease-out lg:whitespace-nowrap ${titleCls} ${isLight ? "group-hover:text-violet-600" : "group-hover:text-violet-200"}`}
                        >
                          {f.title}
                        </h3>
                      </div>
                      <p
                        className={`max-w-[322px] font-['Inter',sans-serif] text-[16px] font-normal leading-[26px] tracking-[-0.01em] transition-colors duration-300 ease-out ${bodyCls} ${isLight ? "group-hover:text-violet-800/90" : "group-hover:text-white/88"}`}
                      >
                        {f.body}
                      </p>
                    </motion.article>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ContentSections = () => {
  return (
    <>
      <ProblemFeaturesSection />

      <LeadershipCarouselSection />
    </>
  );
};

export default ContentSections;
