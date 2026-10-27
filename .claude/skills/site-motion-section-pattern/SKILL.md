---
name: site-motion-section-pattern
description: framer-motion scroll-reveal and step-transition convention used across the Ethos section islands. Use when adding scroll-triggered reveal animations, animating a new section on scroll into view, staggering a list, swapping wizard steps or modal panels with AnimatePresence, or wiring framer-motion into a component. Even if the user just says "anima essa seção", "fade in on scroll" or "add a transition".
source: scan
---

<!-- mustard:generated -->

# Site Motion Section Pattern

> Restrained framer-motion recipe after the 54cf921 visual refactor: short, once-only reveals on scroll and keyed panel swaps. No hover/tap motion, no parallax, no module-level Variants.

## Convention

| Aspect            | Convention (majority observed)                                                                              | Evidence                                                                 |
| ----------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Library           | `import { motion } from "framer-motion"` (+ `AnimatePresence` when swapping panels)                         | 13/22 islands import framer-motion                                       |
| Scroll reveal     | `initial` + `whileInView` + `viewport={{ once: true }}` on `motion.div`                                     | 10/22 use `whileInView`; `once: true` in 11/22                           |
| Distance/duration | `opacity: 0` with `y: 12–30` (or `x: -20` for side blocks), `duration` 0.35–0.7                            | Testimonials, Mission, Benefits, FAQ, WizardSection                      |
| Stagger           | per-item `transition={{ delay: index * 0.06–0.08 }}` inside `.map()`                                        | 5/22: Benefits, Mission, Testimonials, PortfolioHome, PortfolioPage      |
| Viewport margin   | optional `viewport={{ once: true, margin: "-100px" }}` to trigger later                                    | Mission, PortfolioHome                                                   |
| Panel swaps       | `<AnimatePresence mode="wait">` wrapping keyed `motion.div` with `initial/animate/exit` (x-slide ±30)      | 5/22: WizardSection, ServicesHome, ServicesPage, PortfolioPage, EthosIA  |
| `animate`         | reserved for mount/state-driven motion (progress bar, modals, chat), not scroll reveal                     | 7/22                                                                     |
| Not used          | `Variants` objects, `whileHover`/`whileTap`, `useScroll`/`useTransform` parallax                          | 0/22 each                                                                |

Global `prefers-reduced-motion` in `src/styles/global.css` shortens CSS animations/transitions; islands do not call `useReducedMotion` (0/22).

## Real examples

- `src/components/Testimonials.tsx`
- `src/components/Mission.tsx`
- `src/components/Benefits.tsx`
- `src/components/FAQ.tsx`
- `src/components/WizardSection.tsx`

## References

See `references/examples.md`.
