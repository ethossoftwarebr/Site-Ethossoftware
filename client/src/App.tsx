import { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";

const Home = lazy(() => import("@/pages/Home"));
const ServicesPage = lazy(() => import("@/pages/ServicesPage"));
const PortfolioPage = lazy(() => import("@/pages/PortfolioPage"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Minimal route fallback: solid theme background, no spinner — prevents white flash
// while route chunk is fetched. Mirrors body bg so transitions feel uniform.
function RouteLoader() {
  return (
    <div
      className="min-h-screen bg-background"
      aria-hidden="true"
      data-testid="route-loader"
    />
  );
}

function Router() {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/servicos" component={ServicesPage} />
        <Route path="/portfolio" component={PortfolioPage} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
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

export default App;
