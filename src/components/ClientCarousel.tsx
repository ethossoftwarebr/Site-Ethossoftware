import { LazyImage } from "@/components/ui/lazy-image";
import construMais from "@/assets/clients/image_1772062082099.png?w=200;400&format=avif;webp;png&as=picture";
import advLeite from "@/assets/clients/image_1772062142489.png?w=200;400&format=avif;webp;png&as=picture";
import elyudFreitas from "@/assets/clients/image_1772062172289.png?w=200;400&format=avif;webp;png&as=picture";
import silvaGomes from "@/assets/clients/logotipo-advogado-gomes_1772062181314.png?w=200;400&format=avif;webp;png&as=picture";
import contacnet from "@/assets/clients/Logo-Contac-Colorida_(1)_1772062181315.png?w=200;400&format=avif;webp;png&as=picture";
import promedico from "@/assets/clients/image_1772062204753.png?w=200;400&format=avif;webp;png&as=picture";
import redeConstrucao from "@/assets/clients/image_1772062247508.png?w=200;400&format=avif;webp;png&as=picture";
import hosOdonto from "@/assets/clients/image_1772062271614.png?w=200;400&format=avif;webp;png&as=picture";
import allVida from "@/assets/clients/image_1772062287989.png?w=200;400&format=avif;webp;png&as=picture";
import villaCarioca from "@/assets/clients/image_1772062338214.png?w=200;400&format=avif;webp;png&as=picture";
import franciscoCamargo from "@/assets/clients/image_1772062706525.png?w=200;400&format=avif;webp;png&as=picture";
import agius from "@/assets/clients/image_1772062730210.png?w=200;400&format=avif;webp;png&as=picture";
import avante from "@/assets/clients/image_1772062747520.png?w=200;400&format=avif;webp;png&as=picture";
import ileva from "@/assets/clients/image_1772062796029.png?w=200;400&format=avif;webp;png&as=picture";
import bbt from "@/assets/clients/image_1772062813471.png?w=200;400&format=avif;webp;png&as=picture";
import caristeo from "@/assets/clients/image_1772062833578.png?w=200;400&format=avif;webp;png&as=picture";

const clients = [
  { name: "ConstruMais", logo: construMais },
  { name: "Advocacia Leite", logo: advLeite },
  { name: "Elyud Freitas", logo: elyudFreitas },
  { name: "Francisco Camargo", logo: franciscoCamargo },
  { name: "Silva Gomes", logo: silvaGomes },
  { name: "Agius", logo: agius },
  { name: "Contacnet", logo: contacnet },
  { name: "Promedico", logo: promedico },
  { name: "Grupo Avante", logo: avante },
  { name: "Rede da Construção", logo: redeConstrucao },
  { name: "Ileva", logo: ileva },
  { name: "HOS Odontológico", logo: hosOdonto },
  { name: "BBT Transportes", logo: bbt },
  { name: "All Vida", logo: allVida },
  { name: "Caristeo", logo: caristeo },
  { name: "Villa Carioca", logo: villaCarioca },
];

export default function ClientCarousel() {
  return (
    <section className="relative z-10 overflow-hidden bg-background py-10 md:py-12">
      <div className="container mx-auto px-4 mb-4 md:mb-8 text-center relative z-10">
        <p className="text-[10px] font-medium uppercase text-muted-foreground md:text-sm">
          Empresas atendidas pela Ethos Software
        </p>
      </div>

      {/* Container with fade edges */}
      <div className="relative z-10 mx-auto w-full max-w-[1200px]">
        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-center gap-10 px-5 md:gap-12 md:px-10">
            {clients.map((client) => (
              <div
                key={client.name}
                className="flex h-12 w-20 flex-shrink-0 items-center justify-center bg-background sm:w-28 md:h-20 md:w-48"
              >
                <LazyImage
                  src={client.logo}
                  alt={`Logo ${client.name}`}
                  sizes="(max-width: 768px) 80px, 192px"
                  className="max-w-full max-h-full"
                  imgClassName="max-w-full max-h-full object-contain mix-blend-normal opacity-75 grayscale"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
