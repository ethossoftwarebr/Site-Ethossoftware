<!-- mustard:generated -->
# Examples — client-page-composition

> Real snippets pulled from the codebase.

## App provider + Wouter routing (`client/src/App.tsx:12`)

```tsx
function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/servicos" component={ServicesPage} />
      <Route path="/portfolio" component={PortfolioPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
```

## Page outer shell (`client/src/pages/PortfolioPage.tsx:22`)

```tsx
export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  return (
    <main className="min-h-screen relative bg-background selection:bg-[#A229F2]/20 selection:text-[#531B8C]">
      <div className="absolute top-0 left-[10%] w-[800px] h-[800px] bg-[#A229F2]/15 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] bg-[#531B8C]/10 rounded-full blur-[100px] -z-10" />

      <Navbar />
      {/* sections... */}
      <Footer />
      <WhatsAppButton />
      <EthosIA />
    </main>
  );
}
```

## Home flex-stack of sections (`client/src/pages/Home.tsx:50`)

```tsx
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
```

## Hash-on-mount smooth scroll (`client/src/pages/Home.tsx:19`)

```tsx
useEffect(() => {
  const hash = window.location.hash.slice(1);
  if (!hash) return;
  const scrollToSection = () => {
    const el = document.getElementById(hash);
    if (el) { el.scrollIntoView({ behavior: "smooth" }); return true; }
    return false;
  };
  if (!scrollToSection()) {
    const observer = new MutationObserver(() => {
      if (scrollToSection()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const timeout = setTimeout(() => observer.disconnect(), 3000);
    return () => { observer.disconnect(); clearTimeout(timeout); };
  }
}, []);
```
