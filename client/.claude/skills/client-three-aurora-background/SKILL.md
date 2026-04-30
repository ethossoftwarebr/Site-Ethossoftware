---
name: client-three-aurora-background
description: Use when adding or modifying a WebGL/three.js animated background, shader-based decoration, or any heavy GPU effect that needs reduced-motion + low-end + WebGL fallback. Triggers on "three.js", "webgl", "shader", "aurora", "animated background", "gpu effect".
source: scan
---
<!-- mustard:generated -->

# Client three.js Aurora Background

> Pattern for adding GPU-accelerated visuals that fail safely on low-end devices, reduced-motion preferences, or browsers without WebGL.

## When to use

- Adding a fullscreen or section-scoped animated shader background
- Wrapping any `three.js` scene that mounts inside React
- Replacing a static gradient with a dynamic one and needing a fallback path

## Hard requirements

1. Default-export a function component that returns an `aria-hidden="true"` absolutely positioned mount point.
2. **Capability gate** at the top of `useEffect`:
   - `window.matchMedia("(prefers-reduced-motion: reduce)").matches`
   - `navigator.hardwareConcurrency < 4`
   - WebGL canvas context probe
   On any miss, set fallback state and return.
3. **Dynamically import three:** `const THREE = await import("three");` so the heavy chunk splits.
4. **Fallback render:** when fallback is true, return an absolutely positioned div with a CSS radial gradient using brand purples — never an empty fragment.
5. Cap `setPixelRatio(Math.min(window.devicePixelRatio, 1.5))` to limit fragment shader load on retina screens.
6. **Cleanup** on unmount: `cancelAnimationFrame`, `removeEventListener("resize", ...)`, `el.removeChild(renderer.domElement)`, `renderer.dispose()`, `material.dispose()`, `geometry.dispose()`.
7. The shader's color palette MUST stay within the Ethos violet/magenta/purple family (see fragment shader at `AuroraBackground.tsx:107`).

## Mounting

Place the component as the FIRST child of the section it decorates, with the section providing `relative overflow-hidden`. Surrounding content sits on a higher `z-index`.

```tsx
<section className="relative overflow-hidden bg-[#07050f]">
  <AuroraBackground />
  <div className="absolute inset-0 pointer-events-none z-[5]" style={{ background: "radial-gradient(...)" }} />
  <div className="relative z-20">{/* readable content */}</div>
</section>
```

## When NOT to use

- For purely decorative CSS gradients/blurs, use Tailwind `blur-[120px] bg-[#A229F2]/15` instead.
- For 2D canvas particle effects, see existing `Sparkles` / `Meteors` components.

## References

- Reference component: `client/src/components/AuroraBackground.tsx:20`
- Capability checks: `client/src/components/AuroraBackground.tsx:25`
- Dynamic three import: `client/src/components/AuroraBackground.tsx:42`
- Fallback render: `client/src/components/AuroraBackground.tsx:171`
- Real usage in section: `client/src/pages/ServicesPage.tsx:163`
- Real code in `references/examples.md`.
