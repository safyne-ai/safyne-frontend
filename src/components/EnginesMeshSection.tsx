import { motion, useInView, useReducedMotion, type TargetAndTransition } from "framer-motion";
import { useRef } from "react";
import { useTheme } from "@/hooks/use-theme";

/**
 * “Companies” logo wall — AI Startup Website UI Kit
 * https://www.figma.com/design/f0ZCnin5svWEUYpT9fp7C0/AI-Startup-Website-UI-Kit-%E2%80%94-Framer-Website-Kit--Community-?node-id=15-53
 * Logo/Box: 40px × 32px padding, 10px radius, 10px gutters; inner mark ~155×34 slot — swap SVGs when ready.
 */
const models = [
  { name: "OpenAI", Svg: ModelSvgOpenAI },
  { name: "Anthropic", Svg: ModelSvgAnthropic },
  { name: "Google Gemini", Svg: ModelSvgGemini },
  { name: "DeepSeek", Svg: ModelSvgDeepSeek },
  { name: "Kimi", Svg: ModelSvgKimi },
  { name: "Smart route", Svg: ModelSvgRoute },
  { name: "Mistral", Svg: ModelSvgMistral },
  { name: "Meta Llama", Svg: ModelSvgLlama },
] as const;

const EnginesMeshSection = () => {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const sectionBg = isLight
    ? "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(139, 92, 246, 0.06) 45%, rgba(255,255,255,0) 100%), radial-gradient(circle at 50% 0%, rgba(124, 58, 237, 0.12) 0%, rgba(250, 248, 255, 1) 55%)"
    : "#000000";

  const boxBorder = isLight ? "border-violet-200/85" : "border-[rgba(255,255,255,0.15)]";
  const boxBg = isLight ? "bg-white/60" : "bg-transparent";
  const boxHover = isLight
    ? "hover:border-violet-400 hover:bg-white/90 hover:shadow-[0_12px_40px_-20px_rgba(91,33,182,0.2)]"
    : "hover:border-[rgba(196,181,253,0.45)] hover:shadow-[0_0_0_1px_rgba(167,139,250,0.12)]";

  /** Figma Body M + professional text hover */
  const subBase = isLight ? "text-slate-600" : "text-[rgba(255,255,255,0.7)]";
  const subHover = isLight ? "hover:text-violet-700" : "hover:text-violet-200";

  const h2Base = isLight ? "text-slate-900" : "text-white";
  const h2Hover = isLight ? "hover:text-violet-800" : "hover:text-violet-200";

  const nameBase = isLight ? "text-slate-900" : "text-white";
  const nameHover = isLight ? "hover:text-violet-700" : "hover:text-violet-200";

  const itemHidden = reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 };
  const itemShow = (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const, delay: reduceMotion ? 0 : 0.05 + i * 0.05 },
  });

  return (
    <section
      ref={ref}
      id="engines"
      className="relative border-y transition-colors duration-500"
      style={{
        background: sectionBg,
        borderColor: isLight ? "rgba(167, 139, 250, 0.22)" : "rgba(255, 255, 255, 0.08)",
      }}
    >
      <div className="mx-auto max-w-[1100px] px-4 py-[clamp(3rem,9vw,5.5rem)] sm:px-6 md:px-[min(129px,7vw)]">
        <motion.div
          className="flex flex-col items-center gap-10"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
          }}
        >
          <div className="flex w-full flex-col items-center text-center">
            <motion.h2
              variants={{ hidden: itemHidden, visible: itemShow(0) }}
              className={`max-w-[900px] cursor-default text-balance text-[clamp(1.85rem,5vw,3.5rem)] font-medium leading-[1.16] tracking-[-0.015em] transition-colors duration-300 ease-out md:text-[56px] md:leading-[65px] ${h2Base} ${h2Hover}`}
            >
              Your insight, powered by the best in class.
            </motion.h2>

            <motion.p
              variants={{ hidden: itemHidden, visible: itemShow(1) }}
              className={`mt-6 max-w-[640px] cursor-default font-['Inter',sans-serif] text-[16px] font-normal leading-[26px] tracking-[-0.01em] transition-colors duration-300 ease-out md:mt-8 ${subBase} ${subHover}`}
            >
              Our models on one routing fabric — not a “trusted partner” wall. Every tier reaches GPT, Claude,
              Gemini, and the rest through a single wallet, with zero vendor lock-in.
            </motion.p>
          </div>

          {/* Figma Logos: 2 rows × 4, gap 10px */}
          <motion.div
            variants={{ hidden: itemHidden, visible: itemShow(2) }}
            className="flex w-full flex-col gap-[10px]"
          >
            <div className="grid grid-cols-2 gap-[10px] md:grid-cols-4">
              {models.slice(0, 4).map((m, i) => (
                <ModelLogoBox
                  key={m.name}
                  model={m}
                  isLight={isLight}
                  boxBorder={boxBorder}
                  boxBg={boxBg}
                  boxHover={boxHover}
                  nameBase={nameBase}
                  nameHover={nameHover}
                  reduceMotion={!!reduceMotion}
                  animIndex={i + 3}
                  inView={inView}
                  itemHidden={itemHidden}
                  itemShow={itemShow}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-[10px] md:grid-cols-4">
              {models.slice(4, 8).map((m, i) => (
                <ModelLogoBox
                  key={m.name}
                  model={m}
                  isLight={isLight}
                  boxBorder={boxBorder}
                  boxBg={boxBg}
                  boxHover={boxHover}
                  nameBase={nameBase}
                  nameHover={nameHover}
                  reduceMotion={!!reduceMotion}
                  animIndex={i + 7}
                  inView={inView}
                  itemHidden={itemHidden}
                  itemShow={itemShow}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

function ModelLogoBox({
  model,
  isLight,
  boxBorder,
  boxBg,
  boxHover,
  nameBase,
  nameHover,
  reduceMotion,
  animIndex,
  inView,
  itemHidden,
  itemShow,
}: {
  model: (typeof models)[number];
  isLight: boolean;
  boxBorder: string;
  boxBg: string;
  boxHover: string;
  nameBase: string;
  nameHover: string;
  reduceMotion: boolean;
  animIndex: number;
  inView: boolean;
  itemHidden: { opacity: number; y: number };
  itemShow: (i: number) => TargetAndTransition;
}) {
  return (
    <motion.div
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{ hidden: itemHidden, visible: itemShow(animIndex) }}
      whileHover={reduceMotion ? undefined : { y: -2, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
      className={`group flex min-h-[98px] items-center justify-center border border-solid px-6 py-8 transition-[border-color,box-shadow,transform,background-color] duration-300 ease-out sm:min-h-[106px] sm:px-10 ${boxBorder} ${boxBg} ${boxHover} rounded-[10px]`}
    >
      <div className="flex max-w-[220px] items-center justify-center gap-3">
        <div
          className={`relative h-[34px] w-[34px] shrink-0 transition-opacity duration-300 ease-out group-hover:opacity-100 ${isLight ? "opacity-90" : "opacity-95"}`}
          aria-hidden
        >
          <model.Svg isLight={isLight} className="size-[34px] [&_path]:transition-[fill,stroke,opacity] [&_path]:duration-300 group-hover:[&_path]:opacity-100" />
        </div>
        <span
          className={`min-w-0 font-['Inter',sans-serif] text-[14px] font-medium leading-tight tracking-[-0.01em] transition-colors duration-300 ease-out sm:text-[15px] ${nameBase} ${nameHover}`}
        >
          {model.name}
        </span>
      </div>
    </motion.div>
  );
}

function iconColors(isLight: boolean) {
  return {
    stroke: isLight ? "#5b21b6" : "#e9d5ff",
    fill: isLight ? "#7c3aed" : "#c4b5fd",
  };
}

function ModelSvgOpenAI({ className, isLight }: { className?: string; isLight: boolean }) {
  const { stroke, fill } = iconColors(isLight);
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      <path d="M16 4l10 6v12l-10 6L6 22V10L16 4z" stroke={stroke} strokeWidth="1.2" fill={fill} fillOpacity={0.15} />
      <circle cx="16" cy="16" r="3.5" fill={fill} fillOpacity={0.85} />
    </svg>
  );
}

function ModelSvgAnthropic({ className, isLight }: { className?: string; isLight: boolean }) {
  const { stroke, fill } = iconColors(isLight);
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      <path d="M8 22V10l6 6-6 6z" fill={fill} fillOpacity={0.35} stroke={stroke} strokeWidth="1" />
      <path d="M18 22V10l6 6-6 6z" fill={fill} fillOpacity={0.65} stroke={stroke} strokeWidth="1" />
    </svg>
  );
}

function ModelSvgGemini({ className, isLight }: { className?: string; isLight: boolean }) {
  const { stroke, fill } = iconColors(isLight);
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      <path d="M6 16c4-6 10-6 14 0s-4 6-8 6-10 0-6-6z" stroke={stroke} strokeWidth="1.2" fill={fill} fillOpacity={0.2} />
      <path d="M16 8v16M8 16h16" stroke={stroke} strokeWidth="1" strokeOpacity={0.6} />
    </svg>
  );
}

function ModelSvgDeepSeek({ className, isLight }: { className?: string; isLight: boolean }) {
  const { stroke, fill } = iconColors(isLight);
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      <rect x="6" y="10" width="20" height="12" rx="2" stroke={stroke} strokeWidth="1.2" fill={fill} fillOpacity={0.1} />
      <path d="M10 14h6M10 18h4" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ModelSvgKimi({ className, isLight }: { className?: string; isLight: boolean }) {
  const { stroke, fill } = iconColors(isLight);
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      <circle cx="16" cy="12" r="4" stroke={stroke} strokeWidth="1.2" fill={fill} fillOpacity={0.25} />
      <path d="M10 26c1.2-4.5 3.8-7 6-7s4.8 2.5 6 7" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ModelSvgRoute({ className, isLight }: { className?: string; isLight: boolean }) {
  const { stroke, fill } = iconColors(isLight);
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      <path d="M6 22c4-8 10-12 20-10" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <circle cx="22" cy="12" r="3" fill={fill} fillOpacity={0.85} />
      <circle cx="9" cy="22" r="2.2" fill={fill} fillOpacity={0.45} />
    </svg>
  );
}

function ModelSvgMistral({ className, isLight }: { className?: string; isLight: boolean }) {
  const { stroke, fill } = iconColors(isLight);
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      <path d="M8 24V8l4 10 4-10 4 10 4-10v16" stroke={stroke} strokeWidth="1.3" strokeLinejoin="round" fill="none" />
      <circle cx="16" cy="7" r="2" fill={fill} fillOpacity={0.8} />
    </svg>
  );
}

function ModelSvgLlama({ className, isLight }: { className?: string; isLight: boolean }) {
  const { stroke, fill } = iconColors(isLight);
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      <ellipse cx="16" cy="18" rx="8" ry="6" stroke={stroke} strokeWidth="1.2" fill={fill} fillOpacity={0.12} />
      <circle cx="16" cy="11" r="4.5" stroke={stroke} strokeWidth="1.2" fill={fill} fillOpacity={0.35} />
      <path d="M12 10h2M18 10h2" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export default EnginesMeshSection;
