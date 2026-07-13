<!-- mustard:generated -->

# Site Motion Section Pattern — Examples

Source: `src/components/Testimonials.tsx` (whileInView reveal + index stagger + whileHover)

```tsx
{
  testimonials.map((testimonial, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* ... */}
      <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
        {testimonial.name.charAt(0)}
      </motion.div>
    </motion.div>
  ));
}
```

Source: `src/components/Footer.tsx` (module-level Variants + staggered children)

```tsx
import { motion, type Variants } from "framer-motion";

// Static animation variants — module-level so they're not re-allocated on
// every render of <Footer>.
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
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
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <motion.a
        whileHover={{ y: -5, scale: 1.1 }}
        whileTap={{ scale: 0.95 }} /* ... */
      />
    </motion.div>
  );
}
```

Source: `src/components/WizardSection.tsx` (AnimatePresence step transitions)

```tsx
import { motion, AnimatePresence } from "framer-motion";

<AnimatePresence mode="wait">
  {step === 1 && (
    <motion.div
      key="s1"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
    >
      {/* step content */}
    </motion.div>
  )}
</AnimatePresence>;
```

Source: `src/components/Hero.tsx` (useScroll + useTransform parallax; animate loop)

```tsx
import { motion, useScroll, useTransform } from "framer-motion";

const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ["start start", "end start"],
});
const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

<motion.div
  style={{ y, opacity }}
  className="absolute inset-0 pointer-events-none"
>
  <motion.div
    animate={{ y: [0, -30, 0], rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
    transition={{
      duration: 6,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    }}
  />
</motion.div>;
```
