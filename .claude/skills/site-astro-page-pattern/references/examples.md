<!-- mustard:generated at:2026-09-22T21:31:20.206Z -->

# Astro Page Pattern — real examples from this codebase

> Excerpts verbatim do working tree (linhas indicadas). Re-extrair se o arquivo mudar.

## Homepage composta (NavbarIsland + seções + JSON-LD)

Source: `src/pages/index.astro`

Lines 1-69

```astro
---
import Layout from '@/layouts/Layout.astro';
import NavbarIsland from '@/components/NavbarIsland';
import Hero from '@/components/Hero';
import ClientCarousel from '@/components/ClientCarousel';
import ServicesHome from '@/components/ServicesHome';
import Benefits from '@/components/Benefits';
import PortfolioHome from '@/components/PortfolioHome';
import Testimonials from '@/components/Testimonials';
import About from '@/components/About';
import Mission from '@/components/Mission';
import Instagram from '@/components/Instagram';
import WizardSection from '@/components/WizardSection';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import EthosIA from '@/components/EthosIA';
import { faqItems } from '@/data/faq';
import ogImageAsset from '@/assets/brand/image_1772683408265.png';

const title = 'Ethos Software | Desenvolvimento de Software sob Medida';
const description =
  'Software house em Goiânia especializada em sites, sistemas web, aplicativos e automações com IA desenvolvidos sob medida.';
const canonical = 'https://ethossoftware.com.br';
const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: answer,
    },
  })),
};
---

<Layout
  title={title}
  description={description}
  ogImage={ogImageAsset.src}
  canonical={canonical}
  structuredData={faqStructuredData}
>
  <main
    class="min-h-screen relative overflow-hidden bg-background selection:bg-primary selection:text-white"
  >
    <NavbarIsland client:load />

    <div class="pt-16">
      <Hero client:load />
      <ClientCarousel client:visible />
      <ServicesHome client:visible />
      <Benefits client:visible />
      <PortfolioHome client:visible />
      <Testimonials client:visible />
      <About client:visible />
      <Mission client:visible />
      <Instagram client:visible />
      <WizardSection client:visible />
      <FAQ client:visible />
    </div>

    <Footer client:idle />
    <WhatsAppButton client:idle />
    <EthosIA client:visible />
  </main>
</Layout>
```

## Content page (Navbar + page content + widgets)

Source: `src/pages/servicos.astro`

Lines 1-27

```astro
---
import Layout from '@/layouts/Layout.astro';
import ServicesPage from '@/components/ServicesPage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import EthosIA from '@/components/EthosIA';
import ogImageAsset from '@/assets/brand/image_1772683408265.png';

const title = 'Serviços - Sites, Sistemas, Apps e Automações com IA | Ethos Software';
const description =
  'Conheça os serviços da Ethos Software: criação de sites, landing pages, sistemas web (CRM, ERP, SaaS), aplicativos mobile, automações com IA, e-commerce e integrações via API.';
const canonical = 'https://ethossoftware.com.br/servicos';
---

<Layout
  title={title}
  description={description}
  ogImage={ogImageAsset.src}
  canonical={canonical}
>
  <Navbar client:load />
  <ServicesPage client:visible />
  <Footer client:idle />
  <WhatsAppButton client:idle />
  <EthosIA client:visible />
</Layout>
```

## 404 — sem canonical, noindex via slot, island sem diretiva

Source: `src/pages/404.astro`

Lines 1-18

```astro
---
import Layout from '@/layouts/Layout.astro';
import NotFoundContent from '@/components/NotFoundContent';
import ogImageAsset from '@/assets/brand/image_1772683408265.png';

const title = 'Página não encontrada | Ethos Software';
const description =
  'A página que você procura não existe ou foi movida. Volte para a página inicial da Ethos Software.';
---

<Layout
  title={title}
  description={description}
  ogImage={ogImageAsset.src}
>
  <meta name="robots" content="noindex, nofollow" slot="head" />
  <NotFoundContent />
</Layout>
```

## Layout — props, fallbacks de canonical/og, JSON-LD

Source: `src/layouts/Layout.astro`

Lines 1-76

```astro
---
interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
}
const {
  title = 'Ethos Software',
  description = 'Desenvolvimento de software sob medida',
  ogImage,
  canonical,
  structuredData,
} = Astro.props;
import '@/styles/global.css';
import defaultOgImageAsset from '@/assets/brand/image_1772683408265.png';

const siteUrl = Astro.site ?? Astro.url;
const resolvedCanonical = canonical ?? new URL(Astro.url.pathname, siteUrl).href;
const resolvedOgImage = new URL(ogImage ?? defaultOgImageAsset.src, siteUrl).href;
const extraStructuredData = Array.isArray(structuredData)
  ? structuredData
  : structuredData
    ? [structuredData]
    : [];
const schemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ethos Software',
    url: 'https://ethossoftware.com.br',
    logo: resolvedOgImage,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+55-62-9466-7304',
      contactType: 'sales',
      areaServed: 'BR',
      availableLanguage: 'Portuguese',
    },
  },
  ...extraStructuredData,
];
---
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <meta name="description" content={description} />
    <title>{title}</title>

    <link rel="canonical" href={resolvedCanonical} />

    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="Ethos Software" />
    <meta property="og:url" content={resolvedCanonical} />
    <meta property="og:image" content={resolvedOgImage} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={resolvedOgImage} />

    {schemas.map((schema) => (
      <script is:inline type="application/ld+json" set:html={JSON.stringify(schema)} />
    ))}

    <slot name="head" />
  </head>
  <body>
    <slot />
  </body>
</html>
```
