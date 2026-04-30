<!-- mustard:generated -->
# Recipes — client

> Step-by-step playbooks for the most common additions in the client subproject.

## Recipe 1 — Add a New Page Route

1. Create `client/src/pages/MyPage.tsx`:
   ```tsx
   import { useEffect } from "react";
   import Navbar from "@/components/Navbar";
   import Footer from "@/components/Footer";
   import WhatsAppButton from "@/components/WhatsAppButton";
   import EthosIA from "@/components/EthosIA";

   export default function MyPage() {
     useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);
     return (
       <main className="min-h-screen bg-background relative selection:bg-[#A229F2]/20 selection:text-[#531B8C]">
         <Navbar />
         {/* sections */}
         <Footer />
         <WhatsAppButton />
         <EthosIA />
       </main>
     );
   }
   ```
2. Register the route in `client/src/App.tsx:14`:
   ```tsx
   <Route path="/minha-rota" component={MyPage} />
   ```
   Keep `<Route component={NotFound} />` as the last entry.
3. (Optional) If the page should appear in the navbar, add to `navLinks` in `client/src/components/Navbar.tsx:14`.
4. Verify with `npm run dev:client` then `npm run check`.

## Recipe 2 — Add a New Marketing Section to Home

1. Create `client/src/components/MySection.tsx`:
   ```tsx
   import { motion } from "framer-motion";

   export default function MySection() {
     return (
       <section id="my-section" className="py-16 md:py-24 relative z-10">
         <div className="container mx-auto px-4 max-w-6xl">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
           >
             <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4 tracking-tight">Title</h2>
             <p className="text-muted-foreground text-lg max-w-xl mx-auto">Subtitle</p>
           </motion.div>
         </div>
       </section>
     );
   }
   ```
2. Import + mount inside `client/src/pages/Home.tsx:52` (between existing sections).
3. If the section should appear in scroll-spy, append its `id` to `SECTION_IDS` in `client/src/components/Navbar.tsx:21` and to `SECTION_TO_ANCHOR` mapping (`Navbar.tsx:22`).

## Recipe 3 — Add a New shadcn Primitive (`client/src/components/ui/`)

1. Generate via shadcn CLI _outside_ the repo, then copy the file in. Or hand-author following the pattern of `client/src/components/ui/button.tsx:7`:
   ```tsx
   import * as React from "react"
   import { cva, type VariantProps } from "class-variance-authority"
   import { cn } from "@/lib/utils"

   const myThingVariants = cva("base classes", {
     variants: { variant: { default: "...", outline: "..." } },
     defaultVariants: { variant: "default" },
   })

   export interface MyThingProps
     extends React.HTMLAttributes<HTMLDivElement>,
       VariantProps<typeof myThingVariants> {}

   const MyThing = React.forwardRef<HTMLDivElement, MyThingProps>(
     ({ className, variant, ...props }, ref) => (
       <div ref={ref} className={cn(myThingVariants({ variant, className }))} {...props} />
     )
   )
   MyThing.displayName = "MyThing"
   export { MyThing, myThingVariants }
   ```
2. Save as `client/src/components/ui/my-thing.tsx` (kebab-case).
3. If wrapping a Radix package, install it: `npm i @radix-ui/react-<x>`.
4. Consume from anywhere via `import { MyThing } from "@/components/ui/my-thing"`.

## Recipe 4 — Add a Custom Project Primitive (Brand-Specific)

For non-shadcn UI like `ShinyButton` (`client/src/components/ui/shiny-button.tsx:14`):

1. Author CSS for novel effects in `client/src/index.css` (see `.shiny-cta` at `index.css:128`). Use `@property` for animatable custom properties.
2. Wrap with a typed React component in `client/src/components/ui/<name>.tsx`. Keep props minimal and accept `className`, `data-testid`, `style`.
3. Always pipe `className` through `cn(...)`.

## Recipe 5 — Add a New Project to the Portfolio

1. Drop the screenshot under `attached_assets/` (PNG/JPG).
2. Append a `Project` entry to `client/src/data/projects.ts:17`:
   ```ts
   {
     title: "Nome do Projeto",
     category: "Site Institucional", // must exist in `categories` array (line 69) or add it
     description: "Texto curto descrevendo o projeto.",
     image: projNovo, // imported at top of file
     tags: ["React", "Tailwind"],
   }
   ```
3. Import the asset at the top: `import projNovo from "@assets/screenshot-XXXX.png";`
4. If adding a new `category` value, append it to the `categories` const so the filter button appears (`client/src/data/projects.ts:69`).

## Recipe 6 — Wire a New Form with React Hook Form + Zod

1. Define a schema:
   ```ts
   import { z } from "zod";
   const schema = z.object({ email: z.string().email(), name: z.string().min(2) });
   ```
2. Use `useForm` + `zodResolver` (already installed):
   ```tsx
   import { useForm } from "react-hook-form";
   import { zodResolver } from "@hookform/resolvers/zod";
   const form = useForm({ resolver: zodResolver(schema) });
   ```
3. Render with `Form` primitives from `client/src/components/ui/form.tsx`.
4. Surface errors via `useToast()` from `@/hooks/use-toast`.

## Recipe 7 — Add a New Wizard Step

To extend `WizardSection.tsx:171`:

1. Bump `TOTAL_STEPS` (`WizardSection.tsx:185`) and append a new entry to the `steps` array (`WizardSection.tsx:135`).
2. Add the field to `WizardData` interface (`WizardSection.tsx:22`) and to the initial `useState` (`WizardSection.tsx:174`).
3. Add a `canAdvance()` branch in the switch.
4. Add the step JSX inside the `<AnimatePresence mode="wait">` block, mirroring the `motion.div` pattern of step 5.
5. If the step is conditional (depends on `profile`), follow the `showStageStep` skip-logic at `WizardSection.tsx:206`.
6. Update `buildMessage(data)` (`WizardSection.tsx:145`) to include the new field in the WhatsApp template.

## Recipe 8 — Add a Heavy Animated Background

Mirror `AuroraBackground` (`client/src/components/AuroraBackground.tsx:20`):

1. Create `client/src/components/MyBackground.tsx`.
2. Capability-gate at the top of `useEffect`:
   ```ts
   const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
   const isLowEnd = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency < 4;
   if (prefersReduced || isLowEnd || !isWebGLSupported()) { setFallback(true); return; }
   ```
3. Dynamically import three: `const THREE = await import("three");`
4. Provide a CSS-only fallback `<div>` for the disabled branch.
5. Always cleanup `cancelAnimationFrame`, `removeEventListener("resize", ...)`, and `renderer.dispose()`.

## Recipe 9 — Add a Theme-Aware Component

```tsx
import { useTheme } from "@/components/ThemeProvider";
const { theme, toggle } = useTheme();
// theme === "light" | "dark"
```

For class-based theming, prefer Tailwind `dark:` prefix, e.g. `text-foreground dark:text-white`.
