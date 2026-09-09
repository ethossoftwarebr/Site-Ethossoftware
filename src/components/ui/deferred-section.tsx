import { useEffect, useRef, useState, type ReactNode } from "react";

interface DeferredSectionProps {
  children: ReactNode;
  rootMargin?: string;
  minHeight?: string;
}

/**
 * Hydration-safe scroll-aware section.
 *
 * Initial state is `shouldRender=true` so the children are present on first paint
 *, this matches the prerendered HTML and prevents React 19 hydration mismatches.
 * After hydration, an IntersectionObserver toggles rendering based on viewport
 * proximity: when the section is far from the viewport it unmounts (memory hygiene),
 * and when it approaches again it remounts.
 */
export function DeferredSection({
  children,
  rootMargin = "200px",
  minHeight,
}: DeferredSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => setShouldRender(entry.isIntersecting),
      { rootMargin },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div
      ref={ref}
      data-testid="deferred-section"
      style={minHeight ? { minHeight } : undefined}
    >
      {shouldRender ? children : null}
    </div>
  );
}
