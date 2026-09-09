import { ShinyButton } from "@/components/ui/shiny-button";
import { Button } from "@/components/ui/button";

const WHATSAPP_URL =
  "https://wa.me/556294667304?text=Olá! Gostaria de conversar sobre um projeto com a Ethos Software.";

const capabilities = [
  {
    number: "01",
    title: "Sites e produtos digitais",
    description: "Interfaces responsivas e alinhadas ao objetivo do projeto.",
  },
  {
    number: "02",
    title: "Sistemas sob medida",
    description: "Soluções para organizar processos, acessos e informações.",
  },
  {
    number: "03",
    title: "Automações e integrações",
    description: "Conexão entre ferramentas e redução de tarefas manuais.",
  },
];

export default function Hero() {
  const openWhatsApp = () => window.open(WHATSAPP_URL, "_blank");

  return (
    <section className="relative z-10 border-b border-border bg-[#FBFAFC]">
      <div className="mx-auto grid min-h-[620px] max-w-7xl grid-cols-1 items-center gap-14 px-4 py-20 md:px-6 lg:grid-cols-12 lg:gap-20 lg:py-24">
        <div className="lg:col-span-7">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.18em] text-[#8E2DBA]">
            Tecnologia aplicada ao seu negócio
          </p>

          <h1 className="max-w-3xl text-[40px] font-bold leading-[1.08] tracking-[-0.035em] text-foreground sm:text-5xl lg:text-[62px]">
            Soluções digitais construídas para funcionar no dia a dia.
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            A Ethos desenvolve sites, sistemas e automações a partir de um
            escopo claro, com acompanhamento durante o projeto e responsabilidade
            sobre o que foi acordado.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ShinyButton
              onClick={openWhatsApp}
              className="w-full justify-center sm:w-auto"
              style={{ padding: "0.9rem 1.5rem" }}
            >
              Apresentar meu projeto
            </ShinyButton>

            <Button
              variant="outline"
              size="lg"
              className="h-auto w-full border-border bg-transparent px-6 py-3.5 text-base text-foreground hover:border-primary hover:bg-secondary sm:w-auto"
              onClick={() => {
                window.location.href = "/portfolio";
              }}
            >
              Conhecer o portfólio
            </Button>
          </div>
        </div>

        <aside className="lg:col-span-5" aria-label="Principais áreas de atuação">
          <div className="border-t-[3px] border-[#8E2DBA]">
            <div className="border-b border-border py-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Áreas de atuação
              </p>
            </div>

            {capabilities.map((capability) => (
              <div
                key={capability.number}
                className="grid grid-cols-[2rem_1fr] gap-4 border-b border-border py-5"
              >
                <span className="pt-1 text-[11px] font-bold text-[#8E2DBA]">
                  {capability.number}
                </span>
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    {capability.title}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {capability.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
