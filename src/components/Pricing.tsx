import { Check } from "lucide-react";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { subscribeFreePlan } from "@/lib/api";

type PackCode = "spark" | "catalyst" | "accelerator";

const tiers: {
  code: PackCode;
  price: string;
  credits: string;
  name: string;
  tagline: string;
  description: string;
  perks: string[];
  highlight: boolean;
}[] = [
  {
    code: "spark",
    price: "₹50",
    credits: "450",
    name: "The Spark",
    tagline: "UNLOCKS EFFICIENCY.",
    description:
      "Ideal for rapid-fire questions, drafting emails, summarizing short articles, and everyday problem-solving.",
    perks: ["~Optimized for Fast Mode routing.", "Valid for 90 days", "Smart routing included"],
    highlight: false,
  },
  {
    code: "catalyst",
    price: "₹100",
    credits: "1,000",
    name: "The Catalyst",
    tagline: "UNLOCKS CAPABILITY.",
    description:
      "Perfect for complex coding assistance, deep document analysis, and tasks requiring high-context reasoning.",
    perks: [
      "~1,000 standard prompts",
      "Valid for 90 days",
      "Unlocks Smart Mode intelligence.",
      "Best for hobbyists",
    ],
    highlight: true,
  },
  {
    code: "accelerator",
    price: "₹200",
    credits: "2,200",
    name: "The Accelerator",
    tagline: "UNLOCKS MASTERY.",
    description:
      "The ultimate arsenal. Unrestricted access to elite reasoning engines for massive file analysis and logic-heavy edge cases.",
    perks: [
      "~2,200 standard prompts",
      "Valid for 90 days",
      "Unlocks Smart Mode intelligence.",
      "Full access to Pro Mode reasoning.",
    ],
    highlight: false,
  },
];

const cardTransition = { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const };

/**
 * Pricing — AI Startup UI Kit frame "Pricing" (community).
 * https://www.figma.com/design/u7XNQGbYBU5xAjWth5890e/AI-Startup-Website-UI-Kit-%E2%80%94-Framer-Website-Kit--Community-?node-id=33-2120
 */
const Pricing = () => {
  const navigate = useNavigate();
  const { isLoggedIn, getAccessToken } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-72px" });

  const handleBuy = (packCode: PackCode) => {
    toast("Redirecting to secure checkout...", {
      description: "Please complete billing from your workspace.",
    });
    if (isLoggedIn) {
      navigate(`/chat?billing=1&pack=${packCode}`);
      return;
    }
    navigate(`/auth?next=/chat?billing=1&pack=${packCode}`);
  };

  const handleStartFree = async () => {
    if (!isLoggedIn) {
      navigate("/auth?next=/chat?billing=1&plan=free");
      return;
    }
    try {
      const token = await getAccessToken();
      if (!token) {
        navigate("/auth?next=/chat?billing=1&plan=free");
        return;
      }
      const result = await subscribeFreePlan(token);
      toast.success(result.message ?? "Free plan activated.");
      navigate("/chat");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not activate Free plan.");
    }
  };

  const sectionBg = isLight
    ? "radial-gradient(circle at 50% 52%, rgba(139, 92, 246, 0.14) 0%, rgba(255, 255, 255, 1) 62%)"
    : "radial-gradient(circle at 50% 62%, rgba(86, 41, 157, 0) 0%, rgba(2, 1, 3, 1) 100%)";

  const headHidden = reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 };
  const headShow = { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } };

  const cardHidden = reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 };
  const cardShow = (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { ...cardTransition, delay: reduceMotion ? 0 : 0.08 + i * 0.1 },
  });

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="relative px-5 py-3 transition-colors duration-500 sm:px-10 md:px-[min(129px,8vw)]"
      style={{ background: sectionBg }}
    >
      <div className="mx-auto flex max-w-[1200px] flex-col items-center pb-[clamp(3rem,10vw,7rem)] pt-[clamp(3rem,8vw,5rem)]">
        <motion.div
          className="flex flex-col items-center gap-10"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{
            visible: {
              transition: reduceMotion ? {} : { staggerChildren: 0.09, delayChildren: 0.05 },
            },
            hidden: {},
          }}
        >
          <div className="flex w-full flex-col items-center gap-10 text-center">
            <motion.h2
              variants={{ hidden: headHidden, visible: headShow }}
              className={`w-full max-w-[289px] text-[clamp(2.5rem,5vw,3.5rem)] font-medium leading-[1.16] tracking-[-0.015em] md:text-[56px] md:leading-[65px] ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              Top up. Use anytime.
            </motion.h2>
            <motion.p
              variants={{ hidden: headHidden, visible: headShow }}
              className={`max-w-[433px] text-[18px] font-normal leading-[31px] tracking-[-0.0001em] md:text-[20px] ${
                isLight ? "text-slate-600" : "text-white"
              }`}
            >
              Pay for Power, Not Subscriptions.
            </motion.p>
          </div>

          <motion.div
            variants={{ hidden: headHidden, visible: headShow }}
            className="flex items-center gap-1.5"
          >
            <span className="relative inline-flex h-5 w-[33px] shrink-0 rounded-full bg-[#8C45FF]" aria-hidden>
              <span className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-[#F9F5FF]" />
            </span>
            <span
              className={`text-base font-medium leading-[31px] tracking-[-0.0001em] ${
                isLight ? "text-slate-500" : "text-[rgba(255,255,255,0.5)]"
              }`}
            >
              Credit packs · INR
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          className="mb-8 flex w-full max-w-[307px] flex-col rounded-[10px] border px-5 py-5 sm:max-w-[640px]"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{ hidden: headHidden, visible: headShow }}
          style={
            isLight
              ? { borderColor: "rgba(16, 185, 129, 0.35)", background: "rgba(236, 253, 245, 0.5)" }
              : { borderColor: "rgba(52, 211, 153, 0.35)", background: "rgba(6, 78, 59, 0.15)" }
          }
        >
          <h3 className={`text-2xl font-medium ${isLight ? "text-slate-900" : "text-white"}`}>Free</h3>
          <p className={`mt-1 text-base ${isLight ? "text-slate-600" : "text-white/70"}`}>₹0 · Basic answers via OpenRouter</p>
          <p className={`mt-4 text-sm leading-relaxed ${isLight ? "text-slate-600" : "text-white/60"}`}>
            Try Safyne with no payment. Great for quick questions and everyday chat.
          </p>
          <ul className={`mt-4 space-y-2 text-sm ${isLight ? "text-slate-700" : "text-white/80"}`}>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              Unlimited basic chat (fair-use rate limits apply)
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              No credit card required
            </li>
          </ul>
          <button
            type="button"
            onClick={() => void handleStartFree()}
            className={`mt-6 w-full max-w-[267px] rounded-[10px] border px-4 py-2.5 text-sm font-medium transition hover:brightness-110 ${
              isLight
                ? "border-emerald-300 bg-emerald-600 text-white"
                : "border-emerald-400/40 bg-emerald-600/80 text-white"
            }`}
          >
            Start free
          </button>
        </motion.div>

        <motion.div
          className="mt-[clamp(2rem,6vw,4rem)] flex flex-col flex-wrap items-center justify-center gap-2.5 sm:flex-row sm:items-stretch"
        >
          {tiers.map((tier, index) => (
            <motion.article
              key={tier.code}
              className={`relative flex w-full max-w-[307px] flex-col sm:w-[307px] ${
                tier.highlight ? "min-h-[504px]" : "min-h-[500px]"
              }`}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={{
                hidden: cardHidden,
                visible: (i: number) => cardShow(i),
              }}
              custom={index}
              whileHover={reduceMotion || !tier.highlight ? undefined : { y: -4, transition: { duration: 0.22 } }}
            >
              {tier.highlight ? (
                <>
                  <div
                    className="absolute inset-0 rounded-[10px]"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(1, 0, 2, 1) 0%, rgba(54, 23, 100, 1) 100%)",
                      boxShadow: "0px 10px 74px 10px rgba(78, 0, 191, 0.41)",
                    }}
                  />
                  <div
                    className="pointer-events-none absolute inset-0 rounded-[10px] opacity-30"
                    style={{
                      backgroundImage: `radial-gradient(ellipse 80% 50% at 50% 100%, rgba(140, 69, 255, 0.35) 0%, transparent 55%),
                        repeating-linear-gradient(-12deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 3px)`,
                    }}
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute inset-0 rounded-[10px]"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0, 0, 0, 1) 29%, rgba(0, 0, 0, 0) 100%)",
                    }}
                    aria-hidden
                  />
                </>
              ) : (
                <div
                  className={`absolute inset-0 rounded-[10px] border transition-colors ${
                    isLight
                      ? "border-violet-200/90 bg-white/95 shadow-[0_12px_40px_-16px_rgba(91,33,182,0.18)]"
                      : "border-[rgba(255,255,255,0.15)]"
                  }`}
                  style={!isLight ? { background: "rgba(0, 0, 0, 0.06)" } : undefined}
                  aria-hidden
                />
              )}

              <div className="relative z-[1] flex h-full min-h-0 flex-1 flex-col px-5 pb-5 pt-5">
                <div className="flex flex-col">
                  <div className="flex flex-col gap-1.5 text-left">
                    <h3
                      className={`text-2xl font-medium leading-[31px] tracking-[-0.0004em] ${
                        tier.highlight || !isLight ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {tier.name}
                    </h3>
                    <p
                      className={`max-w-[267px] text-base font-normal leading-[26px] tracking-[-0.0001em] ${
                        tier.highlight || !isLight
                          ? "text-[rgba(255,255,255,0.7)] [&>span]:text-[rgba(255,255,255,0.55)]"
                          : "text-slate-600 [&>span]:text-slate-400"
                      }`}
                    >
                      {tier.price}
                      <span> · </span>
                      {tier.credits} credits
                    </p>
                  </div>

                  <div
                    className={`mt-10 h-px w-[267px] max-w-full shrink-0 ${
                      tier.highlight || !isLight ? "bg-[#282729]" : "bg-violet-200/90"
                    }`}
                  />

                  <ul className="flex min-h-0 flex-col">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-[5px] py-2.5 text-left">
                        <span
                          className={`mt-0.5 flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full border ${
                            tier.highlight || !isLight
                              ? "border-[rgba(255,255,255,0.2)] text-white"
                              : "border-violet-300/90 text-violet-600"
                          }`}
                        >
                          <Check className="h-2.5 w-2.5" strokeWidth={3} />
                        </span>
                        <span
                          className={`min-w-0 flex-1 text-sm font-normal leading-[26px] tracking-[-0.0001em] ${
                            tier.highlight || !isLight ? "text-white" : "text-slate-700"
                          }`}
                        >
                          {perk}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto flex justify-center pt-8">
                  <motion.button
                    type="button"
                    whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                    onClick={() => handleBuy(tier.code)}
                    className={`landing-glow-hover flex w-[267px] max-w-full items-center justify-center gap-2.5 rounded-[10px] px-[15px] py-1.5 text-sm font-normal leading-[26px] tracking-[-0.0001em] shadow-[inset_0_0_6px_3px_rgba(255,255,255,0.25)] backdrop-blur-[14px] transition hover:brightness-110 ${
                      tier.highlight
                        ? "border border-[rgba(255,255,255,0.15)] bg-[rgba(140,69,255,0.4)] text-white"
                        : isLight
                          ? "border border-violet-200/90 bg-violet-50/90 text-violet-950 hover:bg-violet-100/90"
                          : "border border-[rgba(255,255,255,0.15)] bg-[rgba(61,61,61,0.4)] text-white"
                    }`}
                  >
                    Buy {tier.credits} credits
                  </motion.button>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <p
          className={`mt-12 max-w-[433px] text-center text-xs leading-relaxed md:mt-14 ${
            isLight ? "text-slate-500" : "text-[rgba(255,255,255,0.45)]"
          }`}
        >
          Prices in INR. Credits never lose value mid-cycle.
        </p>
      </div>
    </section>
  );
};

export default Pricing;
