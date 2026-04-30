<!-- mustard:generated -->
# Examples — client-marketing-section

> Real snippets pulled from the codebase.

## Section eyebrow + heading + viewport-once reveal (`client/src/pages/ServicesPage.tsx:317`)

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
  className="text-center mb-16"
>
  <p className="text-[#A229F2] font-bold uppercase tracking-widest text-sm mb-3">Nosso processo</p>
  <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
    Como funciona?
  </h2>
  <p className="text-white/60 text-lg max-w-xl mx-auto">
    Processo transparente do início ao fim, com você no controle de cada decisão.
  </p>
</motion.div>
```

## Services grid with staggered cards (`client/src/components/Services.tsx:149`)

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[80rem] mx-auto px-4">
  {services.map((service, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.1, type: "spring", stiffness: 80, damping: 15 }}
    >
      <GradientCard onClick={() => setSelectedService(service)} className="p-6 flex flex-col h-full text-left group">
        {/* card content */}
      </GradientCard>
    </motion.div>
  ))}
</div>
```

## Hero with parallax via useScroll (`client/src/components/Hero.tsx:19`)

```tsx
const containerRef = useRef<HTMLElement>(null);
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ["start start", "end start"],
});
const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

return (
  <section ref={containerRef} className="pt-24 pb-24 ... min-h-[90vh] overflow-hidden bg-gradient-to-b from-background via-card to-background">
    <motion.div style={{ y, opacity }} className="absolute inset-0 pointer-events-none">
      {/* floating icons */}
    </motion.div>
    {/* content */}
  </section>
);
```

## Section id participating in scroll-spy (`client/src/components/Services.tsx:139`)

```tsx
<section id="services" className={`py-16 md:py-20 relative ${selectedService ? 'z-[99999]' : 'z-10'}`}>
```

The `id="services"` matches `SECTION_IDS` in `client/src/components/Navbar.tsx:21`.
