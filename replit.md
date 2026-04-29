# Ethos Software — Landing Page

## Overview
Professional landing page for **Ethos Software**, a software development house based in Goiânia, Brazil. The site showcases services, portfolio, and drives leads via WhatsApp.

## Tech Stack
- **Frontend**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS v4 + Framer Motion animations
- **Routing**: Wouter
- **UI**: Radix UI / shadcn-ui
- **Backend**: Express + Node.js (serves frontend + API)
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Passport.js (session-based)

## Project Structure
```
client/src/
  pages/
    Home.tsx            — Main landing page (all sections)
    PortfolioPage.tsx   — Full portfolio page (/portfolio)
    not-found.tsx       — 404 page
  components/
    Navbar.tsx          — Sticky nav with wizard trigger
    Hero.tsx            — Hero section
    ClientCarousel.tsx  — Client logos
    Services.tsx        — Service cards with modal detail
    Benefits.tsx        — Competitive advantages (dark bg)
    Portfolio.tsx       — 6 projects preview + "Ver mais" button
    Testimonials.tsx    — Client testimonials
    About.tsx           — About + founder
    Mission.tsx         — Mission & values
    Instagram.tsx       — Behold.so Instagram feed embed
    FAQ.tsx             — Accordion FAQ
    Footer.tsx          — Footer
    WhatsAppButton.tsx  — Floating WhatsApp button (opens wizard)
    WhatsAppWizard.tsx  — Multi-step wizard → generates WhatsApp message
  context/
    WizardContext.tsx   — Global state for wizard open/close
  data/
    projects.ts         — Shared project data array
  assets/
    images/             — Local images
```

## Key Features
- **Dark/Light Theme Toggle**: Full theme system with CSS variable switching. `ThemeProvider` + `ThemeToggle` components, `localStorage` persistence, respects OS preference. Toggle button in Navbar (sun/moon icon).
- **WhatsApp Wizard**: 5-step animated form collecting business segment, company size, main pain, desired solutions, and name. Generates a pre-filled WhatsApp message preview and opens wa.me link.
- **Portfolio Page** (`/portfolio`): Full projects listing with category filter tabs and animated grid.
- **Services Page** (`/servicos`): Detailed services with transparent-to-solid navbar, Aurora WebGL background, process steps and tech stack sections.
- **Instagram Feed**: Embedded Behold.so widget (ID: `Mxh7shiOxqSRqBCbiiya`) for @ethossoftware live feed.
- WhatsApp contact: `556294667304`

## Theme System
- CSS: `:root` (light) and `.dark` (dark) CSS variable blocks in `index.css`
- Light: white/gray-95 background, dark foreground
- Dark: deep purple-black (`270 50% 5%`) background, near-white foreground
- Toggle: `ThemeProvider.tsx` wraps App and manages class on `<html>`, `ThemeToggle.tsx` is the button
- All major components updated to use semantic tokens (`bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`) instead of hardcoded colors

## Dev Commands
- `npm run dev` — Start development server (port 5000)
- `npm run build` — Build for production
- `npm run db:push` — Push Drizzle schema to DB
