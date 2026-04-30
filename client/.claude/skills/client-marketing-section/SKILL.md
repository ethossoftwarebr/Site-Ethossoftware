---
name: client-marketing-section
description: Use when creating a new marketing section for the Ethos site (Hero, Services, Benefits, About, FAQ-style components), or refactoring an existing section. Covers framer-motion entrance animations, brand color usage, container layout, and data-testid hooks. Triggers on "new section", "marketing block", "landing section", "add hero", "section component".
source: scan
---
<!-- mustard:generated -->

# Client Marketing Section

> The shape of every default-exported marketing section under `client/src/components/`: motion-on-scroll, container width, brand palette, scroll-spy id when relevant.

## When to use

- Adding a new section component to `client/src/components/<Name>.tsx` for use on Home or a sub-page
- Refactoring an existing section to align with the project's animation/typography rhythm
- Building a CTA banner, stats strip, FAQ block, testimonials block, etc.

## Skeleton

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
          {/* content */}
        </motion.div>
      </div>
    </section>
  );
}
```

## Conventions

1. Default-exported function component, PascalCase filename in `client/src/components/`.
2. Outer `<section>` with `py-16 md:py-24` (or `py-20 md:py-28` for emphasis), `relative z-10`.
3. Inner `<div className="container mx-auto px-4 max-w-{4xl|5xl|6xl}">`.
4. Entrance animations use `motion.div` with `whileInView` + `viewport={{ once: true }}` so they don't replay on backscroll.
5. Stagger lists by `delay: i * 0.08`–`0.1`.
6. Use brand hex literals in Tailwind arbitrary values: `text-[#A229F2]`, `from-[#BA66F2] to-[#531B8C]`. Pair with semantic tokens: `text-foreground`, `text-muted-foreground`, `bg-card`, `bg-background`.
7. Headings: `text-3xl md:text-5xl font-black tracking-tight`. Eyebrow: `text-[#A229F2] font-bold uppercase tracking-widest text-sm`.
8. If the section participates in nav scroll-spy, give it an `id` and add to `SECTION_IDS` in `client/src/components/Navbar.tsx:21`.
9. Add `data-testid` to all CTAs.
10. Mount in `client/src/pages/Home.tsx` between the existing flex-stack siblings.

## Anti-patterns

- DON'T inline `<style>` blocks — use Tailwind classes.
- DON'T use raw HTML `<button>` for the primary CTA — use `ShinyButton` or `Button` from `@/components/ui/`.
- DON'T animate everything; reserve `motion.div` for whole-section reveals and keep nested motion sparing.

## References

- Hero with parallax & floating icons: `client/src/components/Hero.tsx:18`
- Services grid + modal: `client/src/components/Services.tsx:135`
- Inline wizard section (proof of `id` + complex internal state): `client/src/components/WizardSection.tsx:243`
- Real code in `references/examples.md`.
