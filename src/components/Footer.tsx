import logoEthos from "@/assets/brand/Captura_de_tela_2026-02-26_010155-removebg-preview_1772078653004.png";

const solutions = [
  "Sites & Landing Pages",
  "Automações com IA",
  "Sistemas SaaS",
  "Aplicativos Mobile",
];

const companyLinks = [
  { name: "Sobre nós", link: "/#sobre" },
  { name: "Portfólio", link: "/portfolio" },
  { name: "Depoimentos", link: "/#depoimentos" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-border bg-secondary">
      <div className="h-1 bg-primary" aria-hidden="true" />
      <div className="ethos-container py-16 md:py-20">
        <div className="grid gap-12 border-b border-border pb-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4 lg:pr-10">
            <a
              href="/"
              className="flex w-fit items-center gap-3"
              aria-label="Ethos Software, página inicial"
            >
              <img
                src={logoEthos.src}
                alt=""
                className="h-12 w-12 object-contain"
              />
              <span className="text-xl font-bold tracking-[-0.02em] text-foreground">
                Ethos Software
              </span>
            </a>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Desenvolvimento de sites, sistemas e automações sob medida, com
              escopo claro, acompanhamento e responsabilidade sobre as entregas.
            </p>
            <div className="mt-6 flex gap-5">
              <a
                href="https://www.instagram.com/ethossoftware"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-footer-instagram"
                className="text-sm font-semibold text-primary hover:text-accent"
              >
                Instagram
              </a>
              <a
                href="https://www.linkedin.com/company/ethos-software"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-footer-linkedin"
                className="text-sm font-semibold text-primary hover:text-accent"
              >
                LinkedIn
              </a>
            </div>
          </div>

          <div className="lg:col-span-2 lg:col-start-6">
            <h2 className="text-xs font-semibold uppercase text-muted-foreground">
              Soluções
            </h2>
            <ul className="mt-5 space-y-3">
              {solutions.map((item) => (
                <li key={item}>
                  <a
                    href="/servicos"
                    className="text-sm font-medium text-foreground hover:text-primary"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-xs font-semibold uppercase text-muted-foreground">
              Empresa
            </h2>
            <ul className="mt-5 space-y-3">
              {companyLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.link}
                    className="text-sm font-medium text-foreground hover:text-primary"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-xs font-semibold uppercase text-muted-foreground">
              Contato
            </h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">WhatsApp</dt>
                <dd className="mt-1">
                  <a
                    href="https://wa.me/556294667304"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground hover:text-primary"
                  >
                    +55 62 9466-7304
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">
                  E-mail comercial
                </dt>
                <dd className="mt-1 break-words">
                  <a
                    href="mailto:ethosdesenvolvimentosoftware@gmail.com"
                    className="font-medium text-foreground hover:text-primary"
                  >
                    ethosdesenvolvimentosoftware@gmail.com
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">CNPJ</dt>
                <dd className="mt-1 font-medium text-foreground">
                  62.713.066/0001-86
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-7 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {currentYear} Ethos Software. Todos os direitos reservados.
          </p>
          <p>Desenvolvimento de software em Goiânia, GO.</p>
        </div>
      </div>
    </footer>
  );
}
