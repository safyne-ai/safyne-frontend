import { ChevronDown, Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import safyneLogo from "@/assets/safyne-logo.png";

interface HeaderProps {
  onSignIn: () => void;
}

/** Safyne anchors; layout mirrors Figma Nav elements (pill + spacing). */
const navLinks: { label: string; href: string; chevron?: boolean }[] = [
  { label: "Features", href: "#problem", chevron: true },
  { label: "Developers", href: "#leadership" },
  { label: "Company", href: "#pricing", chevron: true },
  { label: "Blog", href: "#problem" },
  { label: "Changelog", href: "#pricing" },
];

const Header = ({ onSignIn }: HeaderProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  const handleSignIn = () => {
    setMobileOpen(false);
    onSignIn();
  };

  const headerBar = isLight
    ? "border-violet-200/80 bg-[rgba(250,248,255,0.92)] backdrop-blur-md"
    : "border-[rgba(255,255,255,0.15)] bg-[#020103]";
  const navPill = isLight ? "border-violet-200/70 bg-white/60" : "border-[rgba(255,255,255,0.15)]";
  const linkClass = isLight
    ? "text-[rgba(30,20,45,0.55)] hover:text-[#1a1224]"
    : "text-[rgba(255,255,255,0.6)] hover:text-white/90";
  const iconBtn = isLight
    ? "border-violet-200/80 text-violet-950/70 hover:bg-violet-100/80 hover:text-violet-950"
    : "border-[rgba(255,255,255,0.15)] text-white/80 hover:bg-white/5 hover:text-white";
  const ctaWrap = isLight ? "border-violet-200/80" : "border-[rgba(255,255,255,0.15)]";

  return (
    <header className={`landing-nav fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ${headerBar}`}>
      <div className="mx-auto hidden max-w-[1200px] items-center justify-center gap-[74px] px-4 py-[13px] md:flex">
        <a href="/" className="flex shrink-0 items-center gap-2.5">
          <img src={safyneLogo} alt="safyne logo" width={38} height={38} className="h-[38px] w-[38px] rounded-lg object-contain" />
          <span
            className={`text-[17px] font-semibold tracking-tight lowercase ${isLight ? "text-violet-950" : "text-white"}`}
          >
            safyne
          </span>
        </a>

        <nav
          className={`flex items-center gap-[30px] rounded-[60px] border px-10 py-2 transition-colors ${navPill}`}
          aria-label="Primary"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`landing-nav-link flex items-center gap-0.5 text-[13px] font-normal leading-[26px] tracking-[-0.0001em] transition ${linkClass}`}
            >
              {link.label}
              {link.chevron ? (
                <ChevronDown className="h-[14px] w-[14px] shrink-0 opacity-60" aria-hidden />
              ) : null}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${iconBtn}`}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <div className={`rounded-[12px] border p-[6px] ${ctaWrap}`}>
            <button
              type="button"
              onClick={handleSignIn}
              className="landing-glow-hover flex h-[30px] min-w-[109px] items-center justify-center rounded-lg border border-[rgba(255,255,255,0.15)] bg-[rgba(140,69,255,0.4)] px-[15px] py-0.5 text-center text-[14px] font-normal leading-[26px] tracking-[-0.0001em] text-white shadow-[inset_0_0_6px_3px_rgba(255,255,255,0.25)] backdrop-blur-[14px] transition hover:bg-[rgba(140,69,255,0.55)]"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3 md:hidden">
        <a href="/" className="flex items-center gap-2">
          <img src={safyneLogo} alt="safyne logo" width={38} height={38} className="h-[38px] w-[38px] rounded-lg object-contain" />
          <span
            className={`text-base font-semibold tracking-tight lowercase ${isLight ? "text-violet-950" : "text-white"}`}
          >
            safyne
          </span>
        </a>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`flex h-9 w-9 items-center justify-center rounded-lg border ${iconBtn}`}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border ${isLight ? "border-violet-200/80 text-violet-950" : "border-[rgba(255,255,255,0.15)] text-white"}`}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          className={`border-t md:hidden ${isLight ? "border-violet-200/80 bg-[#faf8ff]" : "border-[rgba(255,255,255,0.15)] bg-[#020103]"}`}
        >
          <div className="mx-auto flex max-w-[1200px] flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex h-11 items-center rounded-lg px-3 text-[13px] ${isLight ? "text-violet-950/70 hover:bg-violet-100/80" : "text-[rgba(255,255,255,0.6)] hover:bg-white/5 hover:text-white"}`}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 p-[6px]">
              <button
                type="button"
                onClick={handleSignIn}
                className="landing-glow-hover h-[30px] w-full rounded-lg border border-[rgba(255,255,255,0.15)] bg-[rgba(140,69,255,0.4)] text-[14px] font-normal text-white shadow-[inset_0_0_6px_3px_rgba(255,255,255,0.25)] backdrop-blur-[14px]"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
