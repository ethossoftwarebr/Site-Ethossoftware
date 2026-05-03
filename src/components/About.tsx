import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { LazyImage } from "@/components/ui/lazy-image";
import softwareHouseImg from "@/assets/brand/image_1772683408265.png?w=600;1200&quality=70&format=avif;webp;png&as=picture";

export default function About() {
  return (
    <section id="sobre" className="relative z-10 container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex-1 space-y-4 md:space-y-6 text-center md:text-left"
        >
          <span className="text-[#A229F2] font-semibold tracking-wider uppercase text-sm">Nossa História</span>
          <h2 className="font-bold text-foreground text-[28px] sm:text-[32px] md:text-[40px] lg:text-5xl leading-tight">
            Nós transformamos a sua visão em <br className="hidden md:block"/><span className="gradient-text">Realidade Digital</span>
          </h2>
          
          <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            <p>
              A <strong>Ethos Software</strong> é uma software house que nasceu em Goiânia com um propósito claro: solucionar os problemas do dia a dia de empresas através de tecnologia inteligente e melhorar radicalmente a captação de clientes.
            </p>
            <p>
              Nossa história começou quando nosso CEO, João Pedro, decidiu criar soluções reais para empreendedores que precisavam de softwares que realmente ajudassem no cotidiano. Por 3 anos nosso foco foi transformar negócios no estado de Goiás, e hoje estamos em franca expansão para atender empresas de todo o Brasil.
            </p>
            <p>
              Somos uma empresa sempre atualizada com as demandas do mercado. Temos uma equipe dedicada e apaixonada pela criação de sistemas — desde os sites e automações mais simples até as plataformas de gestão mais robustas. Já transformamos a realidade de dezenas de clínicas, contabilidades, advogacias e lojas com códigos bem feitos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 pt-4 md:pt-6">
            {[
              "Soluções sob medida",
              "Foco absoluto em conversão",
              "Design Centrado no Usuário",
              "Tecnologia e Inovação contínua"
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 justify-center md:justify-start">
                <CheckCircle2 className="text-[#A229F2] w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                <span className="text-foreground font-medium text-sm md:text-base">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex-1 relative w-full flex justify-center items-center"
        >
          <div className="relative w-full max-w-md aspect-square">
            {/* Animated decorative circles */}
            <motion.div 
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 90, 0]
              }}
              transition={{ 
                duration: 20, 
                repeat: Infinity,
                ease: "linear" 
              }}
              className="absolute inset-0 bg-gradient-to-tr from-[#A229F2]/20 to-[#531B8C]/20 rounded-full blur-3xl"
            />
            
            <LazyImage
              src={softwareHouseImg}
              alt="Ilustração 3D de Software House"
              sizes="(max-width: 1024px) 100vw, 600px"
              className="relative z-10 w-full h-full"
              imgClassName="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />
            
            {/* Floating elements around illustration */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 -left-10 bg-card p-4 rounded-2xl shadow-xl border border-[#A229F2]/20 z-20"
            >
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="mt-3 space-y-2">
                <div className="h-2 w-20 bg-[#A229F2]/20 rounded" />
                <div className="h-2 w-16 bg-[#531B8C]/20 rounded" />
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [10, -10, 10] }} 
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-10 -right-10 bg-card p-4 rounded-2xl shadow-xl border border-[#A229F2]/20 z-20 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-[#A229F2]/10 flex items-center justify-center text-[#A229F2] font-bold">
                {"</>"}
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">Clean Code</div>
                <div className="text-xs text-muted-foreground">Alta performance</div>
              </div>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
