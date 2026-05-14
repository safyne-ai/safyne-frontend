import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";

/** Light-mode accents — subtle purple sparkles (deterministic layout). */
const SPARKLES = [
  { top: "9%", left: "7%", size: 5, delay: 0, duration: 3.2 },
  { top: "16%", left: "22%", size: 3, delay: 0.4, duration: 2.8 },
  { top: "11%", right: "12%", size: 4, delay: 0.2, duration: 3.5 },
  { top: "28%", right: "22%", size: 3, delay: 0.7, duration: 2.6 },
  { top: "52%", left: "4%", size: 4, delay: 0.1, duration: 3.1 },
  { top: "62%", right: "8%", size: 5, delay: 0.55, duration: 3.4 },
  { top: "40%", left: "14%", size: 2, delay: 0.9, duration: 2.4 },
] as const;

/**
 * Hero — AI Startup UI Kit "Hero" frame.
 * https://www.figma.com/design/f0ZCnin5svWEUYpT9fp7C0/AI-Startup-Website-UI-Kit-%E2%80%94-Framer-Website-Kit--Community-?node-id=33-2112
 */
const Hero = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { theme } = useTheme();
  const [exiting, setExiting] = useState(false);
  const reduceMotion = useReducedMotion();
  const isLight = theme === "light";

  const handleLaunch = () => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => navigate(isLoggedIn ? "/chat" : "/auth"), 500);
  };

  const exitBg = isLight ? "#faf8ff" : "#020103";

  const sectionTransition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const };

  const itemHidden = reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 };
  const itemShow = { opacity: 1, y: 0, transition: sectionTransition };

  const stagger = reduceMotion
    ? {}
    : { staggerChildren: 0.085, delayChildren: 0.06 };

  return (
    <motion.section
      initial={{ opacity: 1, scale: 1 }}
      animate={
        exiting
          ? { opacity: 0, scale: 0.97, backgroundColor: exitBg }
          : { opacity: 1, scale: 1 }
      }
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={`landing-hero relative overflow-hidden pb-0 pt-[calc(73px+40px)] transition-[background-color] duration-500 md:pt-[calc(73px+56px)] ${
        isLight
          ? "bg-gradient-to-b from-[#faf8ff] via-[#f4efff] to-[#ebe4fb]"
          : "bg-[#020103]"
      }`}
    >
      {/* Ambient orbs — kit App & Mask blurs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {!isLight && (
          <>
            <motion.div
              className="absolute left-[15%] top-[18%] h-[825px] w-[825px] -translate-x-1/2 rounded-full bg-[#602A9A] opacity-90 blur-[180px] md:blur-[280px]"
              initial={false}
              animate={
                reduceMotion
                  ? {}
                  : { scale: [1, 1.04, 1], opacity: [0.88, 0.95, 0.88] }
              }
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute left-[45%] top-[28%] h-[569px] w-[569px] -translate-x-1/2 rounded-full bg-[#622A9A] opacity-80 blur-[120px] md:blur-[200px]"
              initial={false}
              animate={
                reduceMotion
                  ? {}
                  : { scale: [1, 1.06, 1], opacity: [0.75, 0.85, 0.75] }
              }
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
          </>
        )}
        {isLight && (
          <>
            <div className="absolute left-[12%] top-[20%] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#c4b5fd] opacity-[0.35] blur-[100px] md:h-[560px] md:w-[560px] md:blur-[140px]" />
            <div className="absolute left-[48%] top-[30%] h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-[#a78bfa] opacity-[0.28] blur-[90px] md:blur-[120px]" />
            <div className="absolute right-[-5%] top-[12%] h-[280px] w-[280px] rounded-full bg-[#ddd6fe] opacity-40 blur-[80px]" />
          </>
        )}
        <div
          className={`absolute inset-0 ${isLight ? "opacity-[0.35]" : "opacity-[0.12]"}`}
          style={{
            backgroundImage: isLight
              ? `radial-gradient(circle at 2px 2px, rgba(124, 58, 237, 0.11) 1px, transparent 0)`
              : `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.14) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Purple sparkles — light theme */}
      {isLight && !reduceMotion && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {SPARKLES.map((s, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-[#8b5cf6] shadow-[0_0_12px_2px_rgba(139,92,246,0.35)]"
              style={{
                top: s.top,
                left: "left" in s ? s.left : undefined,
                right: "right" in s ? s.right : undefined,
                width: s.size,
                height: s.size,
                animation: `landing-sparkle-drift ${s.duration}s ease-in-out infinite`,
                animationDelay: `${s.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-[1] mx-auto max-w-[1200px] px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: stagger },
          }}
          className="mx-auto flex max-w-[900px] flex-col items-center gap-4 text-center"
        >
          {/* Badge/M — kit spacing */}
          <motion.div className="mb-10 flex justify-center md:mb-12" variants={{ hidden: itemHidden, visible: itemShow }}>
            <div
              className={`inline-flex items-center gap-[7px] rounded-full border py-2 pl-[14px] pr-[14px] transition-shadow ${
                isLight
                  ? "border-violet-200/90 bg-white/95 shadow-[0_4px_24px_-4px_rgba(109,40,217,0.2)]"
                  : "border-[rgba(255,255,255,0.15)] bg-black"
              }`}
            >
              <span className="flex h-[18px] min-w-[34px] items-center justify-center rounded-[40px] bg-[#9855FF] px-2 text-[10px] font-bold leading-[26px] tracking-[-0.0001em] text-white">
                NEW
              </span>
              <span className="text-[16px] font-normal leading-[26px] tracking-[-0.0001em] text-[#9855FF]">
                Safyne just launched — multi-model AI, live now
              </span>
            </div>
          </motion.div>

          <motion.h1
            variants={{ hidden: itemHidden, visible: itemShow }}
            className={`max-w-[920px] bg-gradient-to-b bg-clip-text px-2 text-[clamp(2.5rem,6.2vw,5.125rem)] font-medium leading-[1.02] tracking-[-0.0506em] text-transparent md:leading-[84px] ${
              isLight ? "from-[#1a1224] from-[54%] to-[#9333ea]" : "from-white from-[54%] to-[#B372CF]"
            }`}
          >
            Intelligence,
            <br className="hidden sm:block" />{" "}
            <span className="sm:whitespace-nowrap">Directed.</span>
          </motion.h1>

          <motion.p
            variants={{ hidden: itemHidden, visible: itemShow }}
            className={`max-w-[544px] text-[18px] font-normal leading-[31px] tracking-[-0.0001em] md:text-[20px] ${
              isLight ? "text-slate-600" : "text-white"
            }`}
          >
            One prompt. Instant and Powerful result. Ship faster, spend less, stay in flow.
          </motion.p>

          <motion.div className="flex flex-col items-center gap-5 pt-2" variants={{ hidden: itemHidden, visible: itemShow }}>
            {/*
              Kit Hero `33:2112` / node `15:18` + `CtaS`: bordered plate sits *behind* the white CTA (absolute in Figma).
              Match header Sign In energy with a soft violet bloom under the plate.
            */}
            <div className="relative inline-flex items-center justify-center">
              <div
                className={`pointer-events-none absolute -inset-x-6 -inset-y-4 rounded-[22px] blur-[26px] ${
                  isLight ? "bg-violet-500/30" : "bg-[rgba(140,69,255,0.48)]"
                }`}
                aria-hidden
              />
              <div
                className={`pointer-events-none absolute -inset-[6px] rounded-[12px] border ${
                  isLight ? "border-violet-300/70 bg-white/35" : "border-[rgba(255,255,255,0.1)]"
                }`}
                aria-hidden
              />
              <motion.button
                type="button"
                whileHover={reduceMotion ? {} : { scale: 1.02 }}
                whileTap={reduceMotion ? {} : { scale: 0.98 }}
                onClick={handleLaunch}
                className={`landing-glow-hover relative z-10 inline-flex items-center gap-2 rounded-lg px-[15px] py-[5px] text-[15px] font-medium leading-[31px] tracking-[-0.0101em] shadow-lg transition ${
                  isLight
                    ? "bg-zinc-900 text-white shadow-violet-200/50 hover:bg-zinc-800"
                    : "bg-white text-black hover:bg-white/95"
                }`}
              >
                Launch Safyne
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </div>

            <p
              className={`text-[14px] leading-[26px] md:text-[15px] ${
                isLight ? "text-slate-500" : "text-[rgba(255,255,255,0.6)]"
              }`}
            >
              Our platform is new — explore the best models in one workspace.
            </p>

            <div
              className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-[12px] md:text-[13px] ${
                isLight ? "text-slate-500" : "text-[rgba(255,255,255,0.55)]"
              }`}
            >
              {["OpenAi", "Deepseek", "Gemini 3", "Kimi"].map((m) => (
                <span key={m} className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#9855FF]" />
                  {m}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative mx-auto mt-14 max-w-[1120px] md:mt-20"
          initial={reduceMotion ? false : { opacity: 0, y: 36 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        >
          <div
            className={`rounded-[10px] border p-[11px] shadow-[0_-19px_70px_rgba(140,69,255,0.35),0_-20px_70px_rgba(140,69,255,0.2)] ${
              isLight ? "border-violet-200/50 bg-white/50 shadow-violet-200/30" : "border-[rgba(255,255,255,0.1)]"
            }`}
            style={{
              background: isLight
                ? "linear-gradient(-90deg, rgba(250, 248, 255, 1) 0%, rgba(255, 255, 255, 0.65) 48%, rgba(244, 240, 255, 1) 100%)"
                : "linear-gradient(-90deg, rgb(13, 7, 24) 0%, rgba(15, 8, 27, 0) 48%, rgb(11, 6, 20) 100%)",
            }}
          >
            <div
              className={`flex aspect-[1098/560] max-h-[420px] flex-col overflow-hidden rounded-lg border md:max-h-[520px] ${
                isLight ? "border-violet-200/40 bg-white" : "border-[rgba(255,255,255,0.1)] bg-[#0a0612]"
              }`}
            >
              <div
                className={`flex h-9 items-center gap-2 border-b px-3 ${
                  isLight ? "border-violet-100 bg-slate-50/80" : "border-[rgba(255,255,255,0.08)]"
                }`}
              >
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <div
                className={`flex flex-1 items-center justify-center px-6 py-10 ${
                  isLight
                    ? "bg-gradient-to-b from-violet-50/80 to-white"
                    : "bg-gradient-to-b from-[#120a1c] to-[#0a0612]"
                }`}
              >
                <p
                  className={`max-w-md text-center text-[13px] leading-relaxed ${
                    isLight ? "text-slate-400" : "text-[rgba(255,255,255,0.35)]"
                  }`}
                >
                  Product preview — your live chat experience opens after launch.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-[2] h-[min(308px,28vh)]"
        style={{
          background: isLight
            ? "linear-gradient(180deg, transparent 4%, rgb(243, 239, 252) 86%)"
            : "linear-gradient(180deg, transparent 4%, rgb(5, 2, 8) 86%)",
        }}
        aria-hidden
      />
    </motion.section>
  );
};

export default Hero;
