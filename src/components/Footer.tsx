import { motion, type Variants } from "framer-motion";
import logoEthos from "@/assets/brand/Captura_de_tela_2026-02-26_010155-removebg-preview_1772078653004.png";

// Static animation variants, module-level so they're not re-allocated on
// every render of <Footer>.
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Footer() {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="bg-[#67228A] pt-24 pb-8 relative z-10 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/20"></div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20"
        >
          
          <motion.div variants={itemVariants} className="space-y-6 lg:col-span-4 pr-0 lg:pr-8 flex flex-col items-center text-center md:items-start md:text-left">
            <div className="flex items-center group cursor-pointer w-fit">
              <div>
                <img
                  src={logoEthos.src}
                  alt="Ethos Software Logo" 
                  className="w-12 h-12 md:w-14 md:h-14 object-contain filter brightness-0 invert"
                />
              </div>
              <span className="text-xl md:text-2xl font-bold tracking-tight text-white -ml-2">Ethos Software</span>
            </div>
            <p className="text-sm text-[#F7F5F8]/60 leading-relaxed font-light">
              Desenvolvimento de sites, sistemas e automações sob medida, com escopo claro, acompanhamento e responsabilidade sobre as entregas.
            </p>
            <div className="flex gap-4 pt-2 md:pt-4 justify-center md:justify-start">
              <a
                href="https://www.instagram.com/ethossoftware"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da Ethos Software"
                data-testid="link-footer-instagram"
                className="text-sm font-medium text-[#F7F5F8]/70 hover:text-white transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://www.linkedin.com/company/ethos-software"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn da Ethos Software"
                data-testid="link-footer-linkedin"
                className="text-sm font-medium text-[#F7F5F8]/70 hover:text-white transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-2 lg:col-start-6 flex flex-col items-center md:items-start">
            <h4 className="text-white font-semibold mb-6 uppercase tracking-widest text-xs md:border-l-2 border-[#8E2DBA] md:pl-4 flex items-center h-4">Soluções</h4>
            <ul className="space-y-4 text-center md:text-left w-full">
              {['Sites & Landing Pages', 'Automações com IA', 'Sistemas SaaS', 'Aplicativos Mobile'].map((item, i) => (
                <li key={i} className="flex justify-center md:justify-start">
                  <a href="#services" className="text-[#F7F5F8]/60 hover:text-white transition-colors text-sm flex items-center gap-2 group w-fit md:w-full">
                    <span>{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-2 flex flex-col items-center md:items-start">
            <h4 className="text-white font-semibold mb-6 uppercase tracking-widest text-xs md:border-l-2 border-[#8E2DBA] md:pl-4 flex items-center h-4">Empresa</h4>
            <ul className="space-y-4 text-center md:text-left w-full">
              {[
                { name: 'Sobre Nós', link: '#sobre' },
                { name: 'Portfólio', link: '#portfolio' },
                { name: 'Depoimentos', link: '#depoimentos' }
              ].map((item, i) => (
                <li key={i} className="flex justify-center md:justify-start">
                  <a href={item.link} className="text-[#F7F5F8]/60 hover:text-white transition-colors text-sm flex items-center gap-2 group w-fit md:w-full">
                    <span>{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-3 flex flex-col items-center md:items-start">
            <h4 className="text-white font-semibold mb-6 uppercase tracking-widest text-xs md:border-l-2 border-[#8E2DBA] md:pl-4 flex items-center h-4">Fale Conosco</h4>
            <ul className="space-y-6 w-full max-w-[280px] md:max-w-none">
              <li className="flex items-start gap-4 group">
                <div className="flex flex-col pt-0.5">
                  <span className="block text-white/60 text-[10px] uppercase tracking-wider mb-1 font-semibold">WhatsApp</span>
                  <a href="https://wa.me/556294667304" target="_blank" rel="noopener noreferrer" className="text-[#F7F5F8]/80 text-sm hover:text-white transition-colors">
                    +55 62 9466-7304
                  </a>
                </div>
              </li>
              
              <li className="flex items-start gap-4 group">
                <div className="flex flex-col pt-0.5 min-w-0">
                  <span className="block text-white/60 text-[10px] uppercase tracking-wider mb-1 font-semibold">E-mail Comercial</span>
                  <a href="mailto:ethosdesenvolvimentosoftware@gmail.com" className="text-[#F7F5F8]/80 text-sm hover:text-white transition-colors break-all pr-2 line-clamp-1 w-full" title="ethosdesenvolvimentosoftware@gmail.com">
                    ethosdesenvolvimentosoftware@...
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-4 group">
                <div className="flex flex-col pt-0.5">
                  <span className="block text-white/60 text-[10px] uppercase tracking-wider mb-1 font-semibold">Dados da Empresa</span>
                  <span className="text-[#F7F5F8]/80 text-sm">
                    CNPJ: 62.713.066/0001-86
                  </span>
                </div>
              </li>
            </ul>
          </motion.div>

        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 pb-6 md:pb-0"
        >
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-sm text-[#F7F5F8]/50 text-center md:text-left">
              &copy; {anoAtual} Ethos Software. Todos os direitos reservados.
            </p>
            <p className="text-xs text-[#F7F5F8]/30 text-center md:text-left">
              Desenvolvimento de software em Goiânia, GO.
            </p>
          </div>
          
        </motion.div>
      </div>
    </footer>
  );
}
