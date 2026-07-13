<!-- mustard:generated -->

# Site React Island Pattern — Examples

Source: `src/components/Testimonials.tsx`

```tsx
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { GradientCard } from "@/components/ui/gradient-card";

const testimonials = [
  {
    name: "Leandro Chagas",
    role: "Sócio Diretor",
    company: "Office Chagas",
    content: "O sistema desenvolvido pela Ethos...",
    rating: 5,
  },
  // ...
];

export default function Testimonials() {
  return (
    <section
      id="depoimentos"
      className="py-16 md:py-24 bg-background relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#BA66F2]/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} /* ... */>
              <GradientCard className="p-8 flex flex-col h-full">
                {/* ... */}
              </GradientCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

Source: `src/components/Hero.tsx`

```tsx
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MessageCircle, Code2 } from "lucide-react";
import { useRef } from "react";

const floatingIcons = [
  {
    Icon: Code2,
    top: "15%",
    left: "10%",
    delay: 0,
    size: 32,
    color: "text-[#A229F2]",
  },
  // ...
];

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  return (
    <section
      ref={containerRef}
      className="pt-24 pb-24 flex flex-col items-center justify-center text-center relative z-10 min-h-[90vh] overflow-hidden bg-gradient-to-b from-background via-card to-background"
    >
      {/* ... */}
    </section>
  );
}
```

Source: `src/components/WizardSection.tsx`

```tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { profiles, segments, /* ... */ steps } from "@/data/wizard";
import { buildMessage, type WizardData } from "@/lib/wizard-message";

export default function WizardSection() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>({
    profile: "",
    segment: "" /* ... */,
  });

  return (
    <section id="proposta" className="py-16 md:py-20 relative z-10">
      <div className="container mx-auto px-4">
        {/* buttons carry data-testid, e.g.: */}
        <button
          onClick={() => setData((d) => ({ ...d, profile: p.value }))}
          data-testid={`button-profile-${p.value}`}
          className={`flex items-center gap-3 px-4 py-4 rounded-xl border-2 text-left transition-all ${sel ? "border-[#A229F2] bg-[#A229F2]/10" : "border-border hover:border-[#A229F2]/40"}`}
        >
          {/* ... */}
        </button>
      </div>
    </section>
  );
}
```

Source: `src/components/Navbar.tsx` (the ONLY file using cn() — not the default)

```tsx
import { cn } from "@/lib/utils";
// ...
className={cn(
  // conditional classes
)}
```
