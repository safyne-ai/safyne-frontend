import type { ReactNode } from "react";
import { Instagram, Youtube, Mail } from "lucide-react";
import safyneLogo from "@/assets/safyne-logo.png";
import { useTheme } from "@/hooks/use-theme";

/** Figma Footer — AI Startup Website UI Kit node 33:2131 (mirror file f0ZCnin5svWEUYpT9fp7C0). Content: unchanged Safyne links & copy. */

const productLinks = [
  { label: "Pricing", href: "#pricing" },
  { label: "Supported Models", href: "#" },
];

const devLinks = [
  { label: "Documentation", href: "#" },
  { label: "API Reference", href: "#" },
  { label: "Changelog", href: "#" },
  { label: "Support", href: "#" },
];

const companyLinks = [
  { label: "About Us", href: "#" },
  { label: "Contact", href: "#" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/Privacy_Policy.html", external: true },
  { label: "Terms of Service", href: "/t&c.html", external: true },
];

const socials = [
  { Icon: Mail, label: "Email", href: "mailto:safyne.support@gmail.com" },
  { Icon: Instagram, label: "Instagram", href: "https://www.instagram.com/sapphine._?igsh=MWt3em0wd25ib2ZoNw==" },
  { Icon: Youtube, label: "YouTube", href: "https://www.youtube.com/channel/UC9P6JHAEELdlXCWXhduGxjQ" },
];

const Footer = () => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const shell = isLight
    ? "border-violet-200/85 bg-gradient-to-b from-[#f5f3ff] to-[#ede9fe] text-foreground"
    : "border-[rgba(255,255,255,0.15)] bg-black text-foreground";

  const headingClass = isLight
    ? "font-['Inter',sans-serif] text-[13px] font-medium leading-[26px] tracking-[-0.01em] text-slate-900"
    : "font-['Inter',sans-serif] text-[13px] font-medium leading-[26px] tracking-[-0.01em] text-white";

  const linkClass = isLight
    ? "font-['Inter',sans-serif] text-[13px] font-normal leading-[26px] tracking-[-0.01em] text-slate-600/80 transition-colors duration-300 ease-out hover:text-violet-700"
    : "font-['Inter',sans-serif] text-[13px] font-normal leading-[26px] tracking-[-0.01em] text-[rgba(255,255,255,0.5)] transition-colors duration-300 ease-out hover:text-white";

  const brandWordmark = isLight
    ? "font-['Inter',sans-serif] text-lg font-semibold lowercase tracking-tight text-slate-900"
    : "font-['Inter',sans-serif] text-lg font-semibold lowercase tracking-tight text-white";

  const taglineClass = isLight
    ? "mt-4 max-w-xs font-['Inter',sans-serif] text-[13px] font-normal leading-[26px] text-slate-600/90"
    : "mt-4 max-w-xs font-['Inter',sans-serif] text-[13px] font-normal leading-[26px] text-[rgba(255,255,255,0.5)]";

  const socialIconClass = isLight
    ? "text-slate-500 transition-colors duration-300 ease-out hover:text-violet-700"
    : "text-[rgba(255,255,255,0.5)] transition-colors duration-300 ease-out hover:text-white";

  const bottomBorder = isLight ? "border-violet-200/60" : "border-white/10";
  const chip = isLight
    ? "inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/80 px-3 py-1.5 text-xs text-muted-foreground shadow-sm"
    : "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-muted-foreground";

  const uptimeStrong = isLight ? "text-foreground" : "text-white";

  const colClass = "flex flex-col gap-5";

  const LinkCol = ({
    title,
    children,
  }: {
    title: string;
    children: ReactNode;
  }) => (
    <div className={colClass}>
      <h4 className={headingClass}>{title}</h4>
      {children}
    </div>
  );

  return (
    <footer className={`relative border border-solid ${shell}`}>
      <div className="mx-auto max-w-[1200px] px-[45px] py-[41px]">
        {/* Row 1 — kit: logo block + 4-column nav (60px gutters). */}
        <div className="flex flex-col gap-12 lg:flex-row lg:flex-wrap lg:items-start lg:justify-between lg:gap-x-8 lg:gap-y-10">
          <div className="shrink-0 lg:max-w-[240px]">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-[38px] w-[38px] shrink-0 items-center justify-center overflow-hidden rounded-md">
                <img src={safyneLogo} alt="safyne logo" className="h-[38px] w-[38px] object-contain" />
              </div>
              <span className={brandWordmark}>safyne</span>
            </div>
            <p className={taglineClass}>
              The margin-safe AI compute exchange. Predictable APIs, controlled costs.
            </p>
          </div>

          <div className="flex flex-col gap-10 sm:flex-row sm:flex-wrap lg:justify-end">
            <div className="flex flex-col gap-[60px] sm:flex-row">
              <LinkCol title="Product">
                <ul className="flex flex-col gap-5">
                  {productLinks.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className={linkClass}>
                        {l.label}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a href="#" className={`${linkClass} inline-flex items-center gap-2`}>
                      API Status
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-70" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                      </span>
                    </a>
                  </li>
                </ul>
              </LinkCol>
              <LinkCol title="Developers">
                <ul className="flex flex-col gap-5">
                  {devLinks.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className={linkClass}>
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </LinkCol>
            </div>
            <div className="flex flex-col gap-[60px] sm:flex-row">
              <LinkCol title="Company">
                <ul className="flex flex-col gap-5">
                  {companyLinks.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className={linkClass}>
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </LinkCol>
              <LinkCol title="Legal">
                <ul className="flex flex-col gap-5">
                  {legalLinks.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className={linkClass}
                        {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </LinkCol>
            </div>
          </div>
        </div>

        {/* Social row — kit: 24px targets, 30px gap */}
        <div className="mt-12 flex flex-wrap items-center gap-[30px] lg:mt-14">
          {socials.map(({ Icon, label, href }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className={`flex size-6 items-center justify-center ${socialIconClass}`}
            >
              <Icon className="size-6" strokeWidth={1.5} />
            </a>
          ))}
        </div>

        <div
          className={`mt-10 flex flex-col items-start justify-between gap-4 border-t border-solid pt-6 md:flex-row md:items-center ${bottomBorder}`}
        >
          <p className="font-['Inter',sans-serif] text-xs text-muted-foreground">
            © {new Date().getFullYear()} Safyne. All rights reserved.
          </p>
          <div className={chip}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
            </span>
            System Status: <span className={uptimeStrong}>100% Uptime</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
