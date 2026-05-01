import { motion, type Variants } from "framer-motion";
import logoEthos from "@assets/Captura_de_tela_2026-02-26_010155-removebg-preview_1772078653004.png";
import { Mail, Phone, MapPin, Instagram, Linkedin, ChevronRight } from "lucide-react";

export default function Footer() {
  const anoAtual = new Date().getFullYear();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <footer className="bg-[#0A0A0A] pt-24 pb-8 relative z-10 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#A229F2]/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#531B8C]/15 rounded-full blur-[150px] pointer-events-none"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-50"></div>

      {/* Top Border Gradient */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#A229F2]/50 to-transparent"></div>

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
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <img 
                  src={logoEthos} 
                  alt="Ethos Software Logo" 
                  className="w-12 h-12 md:w-14 md:h-14 object-contain filter brightness-0 invert drop-shadow-[0_0_15px_rgba(162,41,242,0.5)]" 
                />
              </motion.div>
              <span className="text-xl md:text-2xl font-bold tracking-tight text-white -ml-2 group-hover:text-[#BA66F2] transition-colors duration-300">Ethos Software</span>
            </div>
            <p className="text-sm text-[#F2F2F2]/60 leading-relaxed font-light">
              Transformando ideias em software de alto impacto. Referência no mercado de tecnologia e desenvolvimento de soluções digitais sob medida para o seu negócio crescer em escala.
            </p>
            <div className="flex gap-4 pt-2 md:pt-4 justify-center md:justify-start">
              <motion.a 
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="https://www.instagram.com/ethossoftware"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da Ethos Software"
                data-testid="link-footer-instagram"
                className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-gradient-to-tr hover:from-[#A229F2] hover:to-[#BA66F2] transition-all duration-300 border border-white/10 hover:border-transparent hover:shadow-[0_0_20px_rgba(162,41,242,0.4)]"
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a 
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="https://www.linkedin.com/company/ethos-software"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn da Ethos Software"
                data-testid="link-footer-linkedin"
                className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-gradient-to-tr hover:from-[#A229F2] hover:to-[#BA66F2] transition-all duration-300 border border-white/10 hover:border-transparent hover:shadow-[0_0_20px_rgba(162,41,242,0.4)]"
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-2 lg:col-start-6 flex flex-col items-center md:items-start">
            <h4 className="text-white font-semibold mb-6 uppercase tracking-widest text-xs md:border-l-2 border-[#A229F2] md:pl-4 flex items-center h-4">Soluções</h4>
            <ul className="space-y-4 text-center md:text-left w-full">
              {['Sites & Landing Pages', 'Automações com IA', 'Sistemas SaaS', 'Aplicativos Mobile'].map((item, i) => (
                <motion.li key={i} whileHover={{ x: 5 }} className="flex justify-center md:justify-start">
                  <a href="#services" className="text-[#F2F2F2]/60 hover:text-white transition-colors text-sm flex items-center gap-2 group w-fit md:w-full">
                    <ChevronRight className="w-3 h-3 text-[#A229F2] hidden md:block opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    <span>{item}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-2 flex flex-col items-center md:items-start">
            <h4 className="text-white font-semibold mb-6 uppercase tracking-widest text-xs md:border-l-2 border-[#A229F2] md:pl-4 flex items-center h-4">Empresa</h4>
            <ul className="space-y-4 text-center md:text-left w-full">
              {[
                { name: 'Sobre Nós', link: '#sobre' },
                { name: 'Casos de Sucesso', link: '#portfolio' },
                { name: 'Depoimentos', link: '#depoimentos' }
              ].map((item, i) => (
                <motion.li key={i} whileHover={{ x: 5 }} className="flex justify-center md:justify-start">
                  <a href={item.link} className="text-[#F2F2F2]/60 hover:text-white transition-colors text-sm flex items-center gap-2 group w-fit md:w-full">
                    <ChevronRight className="w-3 h-3 text-[#A229F2] hidden md:block opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    <span>{item.name}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-3 flex flex-col items-center md:items-start">
            <h4 className="text-white font-semibold mb-6 uppercase tracking-widest text-xs md:border-l-2 border-[#A229F2] md:pl-4 flex items-center h-4">Fale Conosco</h4>
            <ul className="space-y-6 w-full max-w-[280px] md:max-w-none">
              <motion.li whileHover={{ x: 5 }} className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center flex-shrink-0 group-hover:bg-[#A229F2] transition-colors border border-white/5 group-hover:border-transparent">
                  <Phone className="w-4 h-4 text-[#A229F2] group-hover:text-white transition-colors" />
                </div>
                <div className="flex flex-col pt-0.5">
                  <span className="block text-[#9D7ABF] text-[10px] uppercase tracking-wider mb-1 font-semibold">WhatsApp</span>
                  <a href="https://wa.me/556294667304" target="_blank" rel="noopener noreferrer" className="text-[#F2F2F2]/80 text-sm hover:text-white transition-colors">
                    +55 62 9466-7304
                  </a>
                </div>
              </motion.li>
              
              <motion.li whileHover={{ x: 5 }} className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center flex-shrink-0 group-hover:bg-[#A229F2] transition-colors border border-white/5 group-hover:border-transparent">
                  <Mail className="w-4 h-4 text-[#A229F2] group-hover:text-white transition-colors" />
                </div>
                <div className="flex flex-col pt-0.5 min-w-0">
                  <span className="block text-[#9D7ABF] text-[10px] uppercase tracking-wider mb-1 font-semibold">E-mail Comercial</span>
                  <a href="mailto:ethosdesenvolvimentosoftware@gmail.com" className="text-[#F2F2F2]/80 text-sm hover:text-white transition-colors break-all pr-2 line-clamp-1 w-full" title="ethosdesenvolvimentosoftware@gmail.com">
                    ethosdesenvolvimentosoftware@...
                  </a>
                </div>
              </motion.li>

              <motion.li whileHover={{ x: 5 }} className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center flex-shrink-0 group-hover:bg-[#A229F2] transition-colors border border-white/5 group-hover:border-transparent">
                  <MapPin className="w-4 h-4 text-[#A229F2] group-hover:text-white transition-colors" />
                </div>
                <div className="flex flex-col pt-0.5">
                  <span className="block text-[#9D7ABF] text-[10px] uppercase tracking-wider mb-1 font-semibold">Dados da Empresa</span>
                  <span className="text-[#F2F2F2]/80 text-sm">
                    CNPJ: 62.713.066/0001-86
                  </span>
                </div>
              </motion.li>
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
            <p className="text-sm text-[#F2F2F2]/50 text-center md:text-left">
              &copy; {anoAtual} Ethos Software. Todos os direitos reservados.
            </p>
            <p className="text-xs text-[#F2F2F2]/30 text-center md:text-left">
              Feito com excelência em Goiânia, GO para o Brasil inteiro.
            </p>
          </div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 bg-[#1A1A1A] py-2.5 px-5 rounded-full border border-white/5 hover:border-[#A229F2]/30 transition-colors shadow-inner"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#BA66F2] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#A229F2]"></span>
            </span>
            <span className="text-[11px] font-bold text-white tracking-widest uppercase mt-0.5">Sistemas 100% online</span>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
