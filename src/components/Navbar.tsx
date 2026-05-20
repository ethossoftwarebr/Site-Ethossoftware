import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShinyButton } from "@/components/ui/shiny-button";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter } from "@/components/ui/sheet";
import { MenuToggle } from "@/components/ui/menu-toggle";
import { cn } from "@/lib/utils";
import logoEthos from "@/assets/brand/Captura_de_tela_2026-02-26_010155-removebg-preview_1772078653004.png";

const WA_URL =
  "https://wa.me/556294667304?text=Olá! Vim pelo site da Ethos Software e quero conversar sobre um projeto.";

const navLinks = [
  { label: "Soluções", anchor: "services", page: null },
  { label: "Serviços", anchor: null, page: "/servicos" },
  { label: "Portfólio", anchor: "portfolio", page: "/portfolio" },
  { label: "Sobre Nós", anchor: "sobre", page: null },
];

const SECTION_IDS = ["services", "features", "portfolio", "sobre"];
const SECTION_TO_ANCHOR: Record<string, string> = {
  services: "services",
  features: "services",
  portfolio: "portfolio",
  sobre: "sobre",
};

/* Pages whose hero starts dark — navbar begins transparent with white text */
const DARK_HERO_PAGES = ["/servicos"];

function useActiveSection(enabled: boolean) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setActiveSection(null);
      return;
    }

    const navEl = document.querySelector("nav");
    const navHeight = navEl ? navEl.getBoundingClientRect().height : 56;
    const observers: IntersectionObserver[] = [];
    const sectionVisibility: Record<string, number> = {};

    const updateActive = () => {
      let best: string | null = null;
      let bestRatio = 0;
      for (const id of SECTION_IDS) {
        const ratio = sectionVisibility[id] ?? 0;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          best = id;
        }
      }
      setActiveSection(best);
    };

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            sectionVisibility[id] = e.intersectionRatio;
          });
          updateActive();
        },
        {
          threshold: Array.from({ length: 21 }, (_, i) => i * 0.05),
          rootMargin: `-${Math.round(navHeight)}px 0px 0px 0px`,
        },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [enabled]);

  return activeSection;
}

function isLinkActive(
  link: (typeof navLinks)[number],
  activeSection: string | null,
  location: string,
): boolean {
  if (link.page && location === link.page) return true;
  if (link.anchor)
    return (
      activeSection !== null && SECTION_TO_ANCHOR[activeSection] === link.anchor
    );
  return false;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // SSR-safe location: default to "/" on server; sync to window.location on mount.
  const [location, setLocation] = useState<string>("/");
  useEffect(() => {
    if (typeof window !== "undefined") setLocation(window.location.pathname);
  }, []);
  const isHome = location === "/";
  const hasDarkHero = DARK_HERO_PAGES.includes(location);
  const activeSection = useActiveSection(isHome);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* transparent = on dark hero AND not yet scrolled */
  const isTransparent = hasDarkHero && !scrolled;

  const getHref = (anchor: string | null, page: string | null) => {
    if (page === "/servicos") return "/servicos";
    if (page === "/portfolio") return "/portfolio";
    if (!anchor) return "/";
    if (anchor === "portfolio") return isHome ? "#portfolio" : "/portfolio";
    return isHome ? `#${anchor}` : `/#${anchor}`;
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 w-full border-b transition-colors duration-300 ${
          isTransparent
            ? "bg-transparent border-white/10 backdrop-blur-none"
            : "bg-background/95 supports-[backdrop-filter]:bg-background/90 backdrop-blur-lg border-border shadow-sm"
        }`}
      >
        <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
          {/* Logo */}
          <a
            href="/"
            data-testid="link-logo-home"
            className="flex items-center cursor-pointer gap-1"
          >
            <img
              src={logoEthos.src}
              alt="Ethos Software"
              className="w-9 h-9 object-contain transition-[filter] duration-300 brightness-0 invert"
            />
            <span
              className={`font-bold tracking-tight text-[19px] transition-colors duration-300 ${
                isTransparent ? "text-white" : "text-white"
              }`}
            >
              Ethos Software
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const active = isLinkActive(link, activeSection, location);
              return (
                <a
                  key={link.label}
                  href={getHref(link.anchor, link.page)}
                  data-testid={`link-nav-${link.page ?? link.anchor}`}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "relative font-medium text-[15px] transition-colors duration-300",
                    isTransparent
                      ? active
                        ? "text-white hover:text-white hover:bg-white/10"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                      : active
                        ? "text-primary"
                        : "text-foreground/80 hover:text-foreground",
                  )}
                >
                  {link.label}
                  {active && (
                    <span
                      className={`absolute bottom-1.5 left-3 right-3 h-0.5 rounded-full transition-colors duration-300 ${
                        isTransparent ? "bg-white" : "bg-primary"
                      }`}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-2">
            {isTransparent ? (
              <Button
                onClick={() => window.open(WA_URL, "_blank")}
                data-testid="button-falar-especialista-navbar"
                variant="outline"
                className="text-[14px] border-white/40 text-white bg-white/10 hover:bg-white/20 hover:text-white hover:border-white/60"
              >
                Falar com Especialista
              </Button>
            ) : (
              <ShinyButton
                onClick={() => window.open(WA_URL, "_blank")}
                data-testid="button-falar-especialista-navbar"
                className="text-[14px]"
              >
                Falar com Especialista
              </ShinyButton>
            )}
          </div>

          {/* Mobile: hamburger */}
          <div className="lg:hidden flex items-center gap-1">
            <button
              className={`flex items-center justify-center w-9 h-9 rounded-md border transition-colors duration-300 ${
                isTransparent
                  ? "border-white/30 text-white"
                  : "border-border text-foreground"
              }`}
              onClick={() => setOpen(!open)}
              data-testid="button-mobile-menu-toggle"
              aria-label="Abrir menu"
            >
              <MenuToggle strokeWidth={2.5} open={open} />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          hideClose
          className="bg-card supports-[backdrop-filter]:bg-card/95 backdrop-blur-lg flex flex-col gap-0 p-0 w-72 border-r border-border"
        >
          <div className="flex items-center gap-1 px-4 pt-5 pb-4 border-b border-border">
            <img
              src={logoEthos.src}
              alt="Ethos Software"
              className="w-8 h-8 object-contain brightness-0 invert"
            />
            <span className="font-bold text-white text-[17px]">
              Ethos Software
            </span>
          </div>

          <div className="flex flex-col gap-1 px-3 py-4 flex-1 overflow-y-auto">
            {navLinks.map((link) => {
              const active = isLinkActive(link, activeSection, location);
              return (
                <a
                  key={link.label}
                  href={getHref(link.anchor, link.page)}
                  onClick={() => setOpen(false)}
                  data-testid={`link-mobile-nav-${link.page ?? link.anchor}`}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "justify-start text-[15px] font-semibold",
                    active
                      ? "text-primary bg-primary/10"
                      : "text-foreground/80",
                  )}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          <SheetFooter className="p-4 border-t border-border flex-col sm:flex-col gap-2">
            <ShinyButton
              onClick={() => {
                setOpen(false);
                window.open(WA_URL, "_blank");
              }}
              data-testid="button-falar-especialista-mobile"
              className="w-full justify-center text-[15px]"
            >
              Falar com Especialista
            </ShinyButton>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
