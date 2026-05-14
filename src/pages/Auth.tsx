import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";
import safyneLogo from "@/assets/safyne-logo.png";
import { useAuth } from "@/hooks/use-auth";

type Step = "email" | "otp";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { requestOtp, verifyOtp } = useAuth();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => inputsRef.current[0]?.focus(), 100);
    }
  }, [step]);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }
    setSending(true);
    requestOtp(email).then(() => {
      setSending(false);
      setStep("otp");
      toast.success(`Login code sent to ${email}`);
    }).catch((error: unknown) => {
      setSending(false);
      toast.error(error instanceof Error ? error.message : "Failed to send login code");
    });
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) inputsRef.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleOtpPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = Array(6).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setOtp(next);
    inputsRef.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.some((d) => !d)) {
      toast.error("Enter all 6 digits");
      return;
    }
    setVerifying(true);
    verifyOtp(email, otp.join("")).then(() => {
      setVerifying(false);
      toast.success("Welcome to Safyne");
      const next = searchParams.get("next");
      navigate(next && next.startsWith("/") ? next : "/chat");
    }).catch((error: unknown) => {
      setVerifying(false);
      toast.error(error instanceof Error ? error.message : "OTP verification failed");
    });
  };

  const handleBack = () => {
    const hasHistory = window.history.length > 1;
    const sameOriginReferrer =
      typeof document.referrer === "string" &&
      document.referrer.startsWith(window.location.origin);

    if (hasHistory && sameOriginReferrer) {
      navigate(-1);
      return;
    }
    navigate("/", { replace: true });
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* ambient background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div className="pointer-events-none absolute inset-0 backdrop-blur-3xl" />

      <button
        onClick={handleBack}
        type="button"
        className="absolute left-4 top-4 z-10 flex h-10 items-center gap-2 rounded-lg px-3 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-md rounded-2xl border border-border bg-card/80 p-8 shadow-[var(--shadow-card)] backdrop-blur-xl"
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex items-center justify-center gap-2">
              <img src={safyneLogo} alt="Safyne" className="h-10 w-10 rounded-lg object-contain" />
              <span className="font-serif text-xl font-bold lowercase tracking-tight">safyne</span>
            </div>
            <h1 className="text-2xl font-bold text-balance">Access your workspace.</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in instantly. No passwords required.
            </p>
          </div>

          <div className="my-2" />

          {/* Email / OTP */}
          <AnimatePresence mode="wait">
            {step === "email" ? (
              <motion.form
                key="email"
                onSubmit={handleSendCode}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.25 }}
                className="space-y-3"
              >
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    autoComplete="email"
                    className="h-12 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:bg-[hsl(var(--primary-glow))] hover:shadow-[var(--shadow-glow)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {sending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    "Send Login Code"
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="otp"
                onSubmit={handleVerify}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <p className="text-center text-sm text-muted-foreground">
                  Enter the 6-digit code sent to{" "}
                  <span className="font-medium text-foreground">{email}</span>
                </p>
                <div className="flex justify-between gap-2">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (inputsRef.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      onPaste={handleOtpPaste}
                      className="h-12 w-full rounded-lg border border-input bg-background text-center text-lg font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={verifying}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:bg-[hsl(var(--primary-glow))] hover:shadow-[var(--shadow-glow)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {verifying ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verifying…
                    </>
                  ) : (
                    "Verify"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOtp(Array(6).fill(""));
                    setStep("email");
                  }}
                  className="w-full text-center text-xs text-muted-foreground transition hover:text-foreground"
                >
                  Use a different email
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Microcopy */}
          <p className="mt-8 text-center text-xs text-muted-foreground">
            By continuing, you agree to Safyne's{" "}
            <a href="/t&c.html" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a href="/Privacy_Policy.html" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
              Privacy Policy
            </a>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
