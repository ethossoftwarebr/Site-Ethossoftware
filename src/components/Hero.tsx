import { ShinyButton } from "@/components/ui/shiny-button";
import { Button } from "@/components/ui/button";
import { LazyImage } from "@/components/ui/lazy-image";
import { projects } from "@/data/projects";

const WHATSAPP_URL =
  "https://wa.me/556294667304?text=Olá! Gostaria de conversar sobre um projeto com a Ethos Software.";

const featuredProject = projects[4];

export default function Hero() {
  const openWhatsApp = () => window.open(WHATSAPP_URL, "_blank");

  return (
    <section className="relative z-10 bg-background">
      <div className="ethos-container grid min-h-[680px] grid-cols-1 items-center gap-16 py-16 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-6">
          <p className="ethos-eyebrow mb-6">
            Tecnologia aplicada ao seu negócio
          </p>

          <h1 className="max-w-3xl text-[46px] font-bold leading-[1.12] text-foreground sm:text-[58px] lg:text-[68px]">
            Soluções digitais construídas para funcionar no dia a dia.
          </h1>

          <p className="mt-8 max-w-xl text-base leading-[1.7] text-muted-foreground sm:text-xl sm:leading-[1.4]">
            A Ethos desenvolve sites, sistemas e automações a partir de um
            escopo claro, com acompanhamento durante o projeto e
            responsabilidade sobre o que foi acordado.
          </p>

          <div className="mt-10 flex flex-col items-start gap-4">
            <ShinyButton
              onClick={openWhatsApp}
              className="w-full justify-center sm:w-auto"
              style={{ padding: "0.65rem 1.5rem" }}
            >
              Apresentar meu projeto
            </ShinyButton>

            <Button
              size="lg"
              className="text-base font-semibold"
              onClick={() => {
                window.location.href = "/portfolio";
              }}
            >
              Conhecer o portfólio
            </Button>
          </div>
        </div>

        <aside
          className="relative lg:col-span-6"
          aria-label="Projeto em destaque"
        >
          <div
            className="ethos-product-blob ethos-product-blob--vivid -right-8 -top-10 h-56 w-72"
            aria-hidden="true"
          />
          <div
            className="ethos-product-blob ethos-product-blob--deep -bottom-10 -left-8 h-52 w-64"
            aria-hidden="true"
          />
          <div className="ethos-product-card relative overflow-hidden border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                  Projeto entregue
                </p>
                <h2 className="mt-1 text-base font-semibold text-foreground">
                  {featuredProject.title}
                </h2>
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {featuredProject.category}
              </span>
            </div>
            <div className="aspect-[16/11] bg-secondary p-3 sm:p-5">
              <LazyImage
                src={featuredProject.image}
                alt={`Interface do projeto ${featuredProject.title}`}
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-full w-full overflow-hidden rounded-xl border border-border bg-card"
                imgClassName="h-full w-full object-cover object-top"
              />
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-border px-5 py-4">
              {featuredProject.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
