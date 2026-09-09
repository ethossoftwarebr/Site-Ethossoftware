import { useEffect, useState } from "react";
import { ShinyButton } from "@/components/ui/shiny-button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTitle,
} from "@/components/ui/sheet";
import { MenuToggle } from "@/components/ui/menu-toggle";
import { cn } from "@/lib/utils";
import logoEthos from "@/assets/brand/Captura_de_tela_2026-02-26_010155-removebg-preview_1772078653004.png";

const WA_URL =
  "https://wa.me/556294667304?text=Olá! Vim pelo site da Ethos Software e quero conversar sobre um projeto.";

const navLinks = [
  { label: "Início", page: "/", anchor: null },
  { label: "Serviços", page: "/servicos", anchor: null },
  { label: "Portfólio", page: "/portfolio", anchor: null },
  { label: "Empresa", page: null, anchor: "sobre" },
  { label: "Contato", page: null, anchor: "proposta" },
] as const;

const SECTION_IDS = ["sobre", "proposta"];

function useActiveSection(enabled: boolean) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setActiveSection(null);
      return;
    }

    const sectionVisibility: Record<string, number> = {};
    const observers: IntersectionObserver[] = [];

    const updateActive = () => {
      let visibleSection: string | null = null;
      let visibleRatio = 0;

      for (const id of SECTION_IDS) {
        const ratio = sectionVisibility[id] ?? 0;
        if (ratio > visibleRatio) {
          visibleRatio = ratio;
          visibleSection = id;
        }
      }

      setActiveSection(visibleSection);
    };

    for (const id of SECTION_IDS) {
      const element = document.getElementById(id);
      if (!element) continue;

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            sectionVisibility[id] = entry.intersectionRatio;
          }
          updateActive();
        },
        {
          threshold: [0, 0.2, 0.4, 0.6],
          rootMargin: "-120px 0px -45% 0px",
        },
      );

      observer.observe(element);
      observers.push(observer);
    }

    return () => {
      for (const observer of observers) observer.disconnect();
    };
  }, [enabled]);

  return activeSection;
}

function isLinkActive(
  link: (typeof navLinks)[number],
  activeSection: string | null,
  location: string,
) {
  if (link.anchor) return location === "/" && activeSection === link.anchor;
  if (link.page === "/") return location === "/" && activeSection === null;
  return link.page === location;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState("/");

  useEffect(() => {
    setLocation(window.location.pathname);
  }, []);

  const isHome = location === "/";
  const activeSection = useActiveSection(isHome);

  const getHref = (link: (typeof navLinks)[number]) => {
    if (link.page) return link.page;
    return isHome ? `#${link.anchor}` : `/#${link.anchor}`;
  };

  const openWhatsApp = () => window.open(WA_URL, "_blank");

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-[#FBFAFC]">
        <div className="h-1 bg-[#8E2DBA]" aria-hidden="true" />

        <nav className="mx-auto flex h-[76px] w-full max-w-7xl items-stretch justify-between px-4 md:px-6">
          <a
            href="/"
            data-testid="link-logo-home"
            className="flex items-center gap-3 py-3"
            aria-label="Ethos Software, página inicial"
          >
            <img
              src={logoEthos.src}
              alt=""
              className="h-11 w-11 shrink-0 object-contain"
            />
            <span className="whitespace-nowrap text-xl font-bold leading-none tracking-[-0.02em] text-foreground">
              Ethos Software
            </span>
          </a>

          <div className="hidden items-stretch lg:flex">
            {navLinks.map((link) => {
              const active = isLinkActive(link, activeSection, location);

              return (
                <a
                  key={link.label}
                  href={getHref(link)}
                  data-testid={`link-nav-${link.page ?? link.anchor}`}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex items-center px-4 text-[14px] font-medium transition-colors",
                    active
                      ? "text-primary"
                      : "text-foreground/75 hover:text-primary",
                  )}
                >
                  {link.label}
                  {active && (
                    <span
                      className="absolute inset-x-4 bottom-0 h-[3px] bg-[#8E2DBA]"
                      aria-hidden="true"
                    />
                  )}
                </a>
              );
            })}
          </div>

          <div className="hidden items-center lg:flex">
            <ShinyButton
              onClick={openWhatsApp}
              data-testid="button-falar-especialista-navbar"
              className="text-[14px]"
              style={{ padding: "0.75rem 1.25rem" }}
            >
              Falar com a equipe
            </ShinyButton>
          </div>

          <div className="flex items-center lg:hidden">
            <button
              type="button"
              className="flex h-10 items-center gap-3 rounded-md border border-border px-3 text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
              onClick={() => setOpen(true)}
              data-testid="button-mobile-menu-toggle"
              aria-label="Abrir menu"
              aria-expanded={open}
            >
              <span>Menu</span>
              <MenuToggle strokeWidth={2} open={open} />
            </button>
          </div>
        </nav>
      </header>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="flex w-[88vw] max-w-sm flex-col gap-0 border-l border-border bg-card p-0"
        >
          <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
          <div className="h-1 bg-[#8E2DBA]" aria-hidden="true" />

          <div className="flex items-center gap-3 border-b border-border px-5 py-5">
            <img src={logoEthos.src} alt="" className="h-10 w-10 object-contain" />
            <div className="text-lg font-bold tracking-[-0.02em] text-foreground">
              Ethos Software
            </div>
          </div>

          <div className="flex flex-1 flex-col px-5 py-6">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Navegação
            </p>
            <div className="border-t border-border">
              {navLinks.map((link, index) => {
                const active = isLinkActive(link, activeSection, location);

                return (
                  <a
                    key={link.label}
                    href={getHref(link)}
                    onClick={() => setOpen(false)}
                    data-testid={`link-mobile-nav-${link.page ?? link.anchor}`}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-4 border-b border-border py-4 text-base font-semibold transition-colors",
                      active
                        ? "text-primary"
                        : "text-foreground hover:text-primary",
                    )}
                  >
                    <span className="w-5 text-[10px] font-bold text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {link.label}
                  </a>
                );
              })}
            </div>
          </div>

          <SheetFooter className="flex-col gap-4 border-t border-border bg-[#F3EFF5] p-5 sm:flex-col">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Apresente a necessidade da sua empresa para nossa equipe.
            </p>
            <ShinyButton
              onClick={() => {
                setOpen(false);
                openWhatsApp();
              }}
              data-testid="button-falar-especialista-mobile"
              className="w-full justify-center text-[15px]"
            >
              Falar com a equipe
            </ShinyButton>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
