---
name: site-motion-section-pattern
description: framer-motion scroll-reveal animation convention used across the Ethos section islands. Use when adding scroll-triggered reveal animations, animating a new section on scroll into view, or wiring framer-motion into a component.
source: scan
---

<!-- mustard:generated -->

# Site Motion Section Pattern

> The recurring framer-motion scroll-reveal recipe shared by the section islands.

## Convention

| Aspect                | Convention                                                                                                                                                         | Evidence                                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Library               | `framer-motion` (imported `{ motion }`, plus `AnimatePresence`, `useScroll`, `useTransform`, `type Variants` as needed)                                            | 18/23 top-level components import `framer-motion`.                                                       |
| Scroll reveal         | Elements animate on entering the viewport via `initial` + `whileInView` + `viewport={{ once: true }}` — NOT `animate` (that is reserved for mount/always-on loops) | 12/23 files use the `whileInView` + `viewport once:true` pair.                                           |
| Standard reveal       | `initial={{ opacity: 0, y: 30 }}` → `whileInView={{ opacity: 1, y: 0 }}` with a short `transition={{ duration: 0.5–0.8 }}`                                         | Testimonials, WizardSection, Footer bottom bar.                                                          |
| Staggering            | Lists stagger by index: `transition={{ delay: index * 0.1 }}`, or module-level `Variants` with `staggerChildren`/`delayChildren` on a parent + child `variants`    | Testimonials (index delay); Footer (`containerVariants`/`itemVariants`).                                 |
| Variants placement    | Reusable `Variants` objects declared at module level (typed `: Variants`) so they are not re-allocated each render                                                 | Footer declares `containerVariants`/`itemVariants` above the component with a comment noting the reason. |
| Micro-interactions    | Hover/tap feedback via `whileHover` / `whileTap` on `motion.a` / `motion.button` / `motion.li`                                                                     | Footer social links & list items, WizardSection CTA button, Testimonials avatar.                         |
| Parallax / continuous | `useScroll`+`useTransform` for scroll parallax; `animate` with `repeat: Infinity` for idle loops                                                                   | Hero (parallax `y`/`opacity`), Benefits (moving circuit pulses).                                         |
| Step transitions      | Wizard-style step swaps wrap panels in `<AnimatePresence mode="wait">` with `initial/animate/exit` x-slide                                                         | WizardSection.                                                                                           |

## Real examples

- `src/components/Testimonials.tsx`
- `src/components/Footer.tsx`
- `src/components/WizardSection.tsx`
- `src/components/Hero.tsx`
- `src/components/Benefits.tsx`

## References

See `references/examples.md`.
