import { useEffect } from "react";

export interface PageMeta {
  title: string;
  description: string;
  /** Absolute canonical URL for this route. Restored to default on unmount. */
  canonical?: string;
  /** Override for og:image (absolute URL). Default index.html value preserved if omitted. */
  ogImage?: string;
  /** When true, sets `<meta name="robots" content="noindex, nofollow">` for the duration of the route. */
  noindex?: boolean;
}

const DEFAULT_ROBOTS = "index, follow";
const NOINDEX_ROBOTS = "noindex, nofollow";

/**
 * Update or create a meta/link tag in <head>. Returns previous value so callers
 * can restore on cleanup.
 */
function upsertMeta(
  selector: string,
  attrToSet: string,
  newValue: string,
  createFactory: () => HTMLElement,
): string | null {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = createFactory();
    document.head.appendChild(el);
    return null; // signal "we created this — remove on cleanup"
  }
  const prev = el.getAttribute(attrToSet);
  el.setAttribute(attrToSet, newValue);
  return prev;
}

function restoreMeta(
  selector: string,
  attrToSet: string,
  prevValue: string | null,
) {
  const el = document.head.querySelector<HTMLElement>(selector);
  if (!el) return;
  if (prevValue === null) {
    el.remove();
  } else {
    el.setAttribute(attrToSet, prevValue);
  }
}

/**
 * Per-route metadata sync. Call once near the top of each page component.
 *
 * Sets/updates: <title>, meta description, OG title/description/url, canonical,
 * optionally og:image and robots noindex. Restores defaults on unmount so
 * navigation between routes never leaks stale tags.
 */
export function usePageMeta(meta: PageMeta) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = meta.title;

    const undoStack: Array<() => void> = [];

    const track = (
      selector: string,
      attr: string,
      value: string,
      factory: () => HTMLElement,
    ) => {
      const prev = upsertMeta(selector, attr, value, factory);
      undoStack.push(() => restoreMeta(selector, attr, prev));
    };

    // description
    track(
      'meta[name="description"]',
      "content",
      meta.description,
      () => {
        const m = document.createElement("meta");
        m.setAttribute("name", "description");
        return m;
      },
    );

    // og:title
    track(
      'meta[property="og:title"]',
      "content",
      meta.title,
      () => {
        const m = document.createElement("meta");
        m.setAttribute("property", "og:title");
        return m;
      },
    );

    // og:description
    track(
      'meta[property="og:description"]',
      "content",
      meta.description,
      () => {
        const m = document.createElement("meta");
        m.setAttribute("property", "og:description");
        return m;
      },
    );

    // twitter:title
    track(
      'meta[name="twitter:title"]',
      "content",
      meta.title,
      () => {
        const m = document.createElement("meta");
        m.setAttribute("name", "twitter:title");
        return m;
      },
    );

    // twitter:description
    track(
      'meta[name="twitter:description"]',
      "content",
      meta.description,
      () => {
        const m = document.createElement("meta");
        m.setAttribute("name", "twitter:description");
        return m;
      },
    );

    // canonical + og:url
    if (meta.canonical) {
      track(
        'link[rel="canonical"]',
        "href",
        meta.canonical,
        () => {
          const l = document.createElement("link");
          l.setAttribute("rel", "canonical");
          return l;
        },
      );
      track(
        'meta[property="og:url"]',
        "content",
        meta.canonical,
        () => {
          const m = document.createElement("meta");
          m.setAttribute("property", "og:url");
          return m;
        },
      );
    }

    // og:image (optional override)
    if (meta.ogImage) {
      track(
        'meta[property="og:image"]',
        "content",
        meta.ogImage,
        () => {
          const m = document.createElement("meta");
          m.setAttribute("property", "og:image");
          return m;
        },
      );
      track(
        'meta[name="twitter:image"]',
        "content",
        meta.ogImage,
        () => {
          const m = document.createElement("meta");
          m.setAttribute("name", "twitter:image");
          return m;
        },
      );
    }

    // robots — noindex flips the value, restored on unmount
    track(
      'meta[name="robots"]',
      "content",
      meta.noindex ? NOINDEX_ROBOTS : DEFAULT_ROBOTS,
      () => {
        const m = document.createElement("meta");
        m.setAttribute("name", "robots");
        return m;
      },
    );

    return () => {
      document.title = prevTitle;
      // Apply undos in reverse so create-then-restore order is correct
      for (let i = undoStack.length - 1; i >= 0; i--) undoStack[i]();
    };
  }, [
    meta.title,
    meta.description,
    meta.canonical,
    meta.ogImage,
    meta.noindex,
  ]);
}
