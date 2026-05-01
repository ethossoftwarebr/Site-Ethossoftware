import { motion } from "framer-motion";
import { Sparkles } from "@/components/Sparkles";
import construMais from "@/assets/clients/image_1772062082099.png";
import advLeite from "@/assets/clients/image_1772062142489.png";
import elyudFreitas from "@/assets/clients/image_1772062172289.png";
import silvaGomes from "@/assets/clients/logotipo-advogado-gomes_1772062181314.png";
import contacnet from "@/assets/clients/Logo-Contac-Colorida_(1)_1772062181315.png";
import promedico from "@/assets/clients/image_1772062204753.png";
import redeConstrucao from "@/assets/clients/image_1772062247508.png";
import hosOdonto from "@/assets/clients/image_1772062271614.png";
import allVida from "@/assets/clients/image_1772062287989.png";
import villaCarioca from "@/assets/clients/image_1772062338214.png";
import franciscoCamargo from "@/assets/clients/image_1772062706525.png";
import agius from "@/assets/clients/image_1772062730210.png";
import avante from "@/assets/clients/image_1772062747520.png";
import ileva from "@/assets/clients/image_1772062796029.png";
import bbt from "@/assets/clients/image_1772062813471.png";
import caristeo from "@/assets/clients/image_1772062833578.png";

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
  { name: "Villa Carioca", logo: villaCarioca }
];

export default function ClientCarousel() {
  return (
    <section className="py-8 md:py-12 bg-background border-y border-[#A229F2]/10 overflow-hidden relative z-10">
      <Sparkles
        className="absolute inset-0 w-full h-full"
        color="#A229F2"
        background="transparent"
        density={120}
        size={1.2}
        minSize={0.4}
        speed={0.4}
        minSpeed={0.1}
        opacity={0.6}
        minOpacity={0.1}
        opacitySpeed={1.5}
      />
      <div className="container mx-auto px-4 mb-4 md:mb-8 text-center relative z-10">
        <p className="text-[10px] md:text-sm font-semibold text-foreground uppercase tracking-widest">
          Empresas que confiam na Ethos Software
        </p>
      </div>
      
      {/* Container with fade edges */}
      <div className="relative w-full max-w-[90rem] mx-auto z-10">
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
        
        {/* Scrolling track */}
        <div className="flex overflow-hidden">
          <motion.div 
            className="flex whitespace-nowrap gap-8 md:gap-12 items-center px-4 md:px-6"
            animate={{ 
              x: ["0%", "-50%"] 
            }}
            transition={{ 
              ease: "linear",
              duration: 40,
              repeat: Infinity,
            }}
          >
            {/* Duplicamos os itens para criar o efeito infinito */}
            {[...clients, ...clients].map((client, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 hover:scale-105 transition-all duration-300 w-20 sm:w-28 md:w-48 h-12 md:h-20 flex items-center justify-center bg-background"
              >
                <img 
                  src={client.logo} 
                  alt={`Logo ${client.name}`} 
                  className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal dark:opacity-80 dark:brightness-150 dark:contrast-75"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
