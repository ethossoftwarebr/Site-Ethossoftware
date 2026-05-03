// Astro 6 + @tailwindcss/vite (Tailwind v4) does NOT use PostCSS for Tailwind.
// This empty config blocks the parent monorepo's postcss.config.js (which still
// references the deprecated `tailwindcss` PostCSS plugin from the v3 era used
// by client/) from leaking in via Vite's upward config search.
module.exports = { plugins: [] };
