import { X, Mail } from "lucide-react";
import { useEffect } from "react";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#EA4335" d="M12 10.2v3.92h5.46c-.24 1.42-1.7 4.16-5.46 4.16-3.28 0-5.96-2.72-5.96-6.08s2.68-6.08 5.96-6.08c1.86 0 3.12.8 3.84 1.48l2.62-2.52C16.78 3.5 14.62 2.5 12 2.5 6.76 2.5 2.5 6.76 2.5 12S6.76 21.5 12 21.5c6.88 0 9.5-4.84 9.5-7.34 0-.5-.06-.88-.14-1.26H12z"/>
  </svg>
);

const AuthModal = ({ open, onClose, title, description }: AuthModalProps) => {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 glass animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/30">
            <span className="text-xl font-bold text-primary">S</span>
          </div>
          <h2 id="auth-modal-title" className="text-2xl font-bold text-balance">
            {title ?? "Verify your email"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground text-balance">
            {description ?? "Verify your email to see the result and claim 10 free credits."}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onClose}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-border bg-background font-medium text-foreground transition hover:bg-secondary hover:-translate-y-0.5"
          >
            <GoogleIcon />
            Continue with Google
          </button>
          <button
            onClick={onClose}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-primary font-medium text-primary-foreground transition hover:bg-[hsl(var(--primary-glow))] hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]"
          >
            <Mail className="h-5 w-5" />
            Continue with Email
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing, you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
