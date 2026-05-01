import { useEffect } from "react";
import { usePageMeta } from "@/hooks/use-page-meta";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ClientCarousel from "@/components/ClientCarousel";
import Services from "@/components/Services";
import Benefits from "@/components/Benefits";
import About from "@/components/About";
import Mission from "@/components/Mission";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import Instagram from "@/components/Instagram";
import WizardSection from "@/components/WizardSection";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import EthosIA from "@/components/EthosIA";

export default function Home() {
  usePageMeta({
    title: "Ethos Software - Software House em Goiânia | Sites, Sistemas e Apps",
    description:
      "Software house em Goiânia especializada em sites de alta conversão, sistemas web sob medida, apps mobile, automações com IA e dashboards. Mais de 40 projetos entregues com 100% de satisfação.",
    canonical: "https://ethossoftware.com.br",
  });

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const scrollToSection = () => {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return true;
      }
      return false;
    };
    if (!scrollToSection()) {
      const observer = new MutationObserver(() => {
        if (scrollToSection()) observer.disconnect();
      });
      observer.observe(document.body, { childList: true, subtree: true });
      const timeout = setTimeout(() => observer.disconnect(), 3000);
      return () => {
        observer.disconnect();
        clearTimeout(timeout);
      };
    }
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden bg-background selection:bg-[#A229F2]/20 selection:text-[#531B8C]">
      <div className="absolute top-0 left-[10%] w-[800px] h-[800px] bg-[#A229F2]/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-[#531B8C]/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute top-[60%] left-[-20%] w-[900px] h-[900px] bg-[#A229F2]/10 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-[10%] right-[-10%] w-[700px] h-[700px] bg-[#531B8C]/20 rounded-full blur-[120px] -z-10" />
      
      <Navbar />
      
      <div className="flex flex-col gap-12 md:gap-20 pt-16 pb-0">
        <Hero />
        <ClientCarousel />
        <Services />
        <Benefits />
        <Portfolio />
        <Testimonials />
        <About />
        <Mission />
        <Instagram />
        <WizardSection />
        <FAQ />
      </div>

      <Footer />
      <WhatsAppButton />
      <EthosIA />
    </main>
  );
}
