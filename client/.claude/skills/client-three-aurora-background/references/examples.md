<!-- mustard:generated -->
# Examples — client-three-aurora-background

> Real snippets pulled from the codebase.

## WebGL capability probe (`client/src/components/AuroraBackground.tsx:7`)

```tsx
function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const ctx =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return !!ctx;
  } catch {
    return false;
  }
}
```

## Effect with capability gate + dynamic import (`client/src/components/AuroraBackground.tsx:24`)

```tsx
useEffect(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isLowEnd = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency < 4;

  if (prefersReduced || isLowEnd || !isWebGLSupported()) {
    setWebglFailed(true);
    return;
  }

  const el = mountRef.current;
  if (!el) return;

  let THREE: typeof import("three");
  let renderer: import("three").WebGLRenderer | null = null;
  let animId: number;

  const init = async () => {
    try {
      THREE = await import("three");
      // ... build scene, material, mesh
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      // ... animation loop, resize listener
      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("resize", onResize);
        if (renderer && el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
        renderer?.dispose();
        material.dispose();
        geometry.dispose();
      };
    } catch (err) {
      console.warn("AuroraBackground: WebGL init failed, using CSS fallback.", err);
      setWebglFailed(true);
    }
  };

  let cleanup: (() => void) | undefined;
  init().then((fn) => { cleanup = fn; });
  return () => { cancelAnimationFrame(animId); cleanup?.(); };
}, []);
```

## CSS fallback (`client/src/components/AuroraBackground.tsx:171`)

```tsx
if (webglFailed) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      aria-hidden="true"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 20% 40%, #531B8C 0%, #2d0e52 35%, #07050f 70%)",
      }}
    />
  );
}
return <div ref={mountRef} className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden="true" />;
```

## Mount inside a section (`client/src/pages/ServicesPage.tsx:163`)

```tsx
<section className="pt-32 pb-14 md:pt-40 md:pb-16 relative overflow-hidden bg-[#07050f]">
  <AuroraBackground />
  <div
    className="absolute inset-0 pointer-events-none z-[5]"
    style={{
      background:
        "radial-gradient(ellipse 70% 60% at 30% 50%, rgba(7,5,15,0.45) 0%, transparent 100%)",
    }}
  />
  <div className="container mx-auto px-4 max-w-5xl relative z-20">
    {/* readable content above the shader */}
  </div>
</section>
```
