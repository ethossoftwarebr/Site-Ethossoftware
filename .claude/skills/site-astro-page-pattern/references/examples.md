<!-- mustard:generated -->

# Astro Page Pattern — Verbatim Examples

Source: `src/pages/servicos.astro`

```astro
---
import Layout from '@/layouts/Layout.astro';
import ServicesPage from '@/components/ServicesPage';
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
  <ServicesPage client:load />
</Layout>
```

Source: `src/pages/portfolio.astro`

```astro
---
import Layout from '@/layouts/Layout.astro';
import PortfolioPage from '@/components/PortfolioPage';
import ogImageAsset from '@/assets/brand/image_1772683408265.png';

const title = 'Portfólio - Cases de Sucesso em Software | Ethos Software';
const description =
  'Conheça os projetos da Ethos Software: sites institucionais, sistemas de gestão, dashboards SaaS, automações com IA e apps mobile entregues para clientes em todo o Brasil.';
const canonical = 'https://ethossoftware.com.br/portfolio';
---

<Layout
  title={title}
  description={description}
  ogImage={ogImageAsset.src}
  canonical={canonical}
>
  <PortfolioPage client:load />
</Layout>
```

Source: `src/pages/404.astro`

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
  <NotFoundContent client:load />
</Layout>
```

Source: `src/pages/index.astro`

```astro
<Layout
  title={title}
  description={description}
  ogImage={ogImageAsset.src}
  canonical={canonical}
>
  <main class="min-h-screen relative overflow-hidden bg-background ...">
    <NavbarIsland client:load />

    <div class="flex flex-col gap-12 md:gap-20 pt-16 pb-0">
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

Source: `src/layouts/Layout.astro`

```astro
---
interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
}
const {
  title = 'Ethos Software',
  description = 'Desenvolvimento de software sob medida',
  ogImage,
  canonical,
} = Astro.props;
import '@/styles/global.css';
---
<!doctype html>
<html lang="pt-BR" class="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <meta name="description" content={description} />
    <title>{title}</title>

    {canonical && <link rel="canonical" href={canonical} />}

    {ogImage && (
      <>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:site_name" content="Ethos Software" />
        {canonical && <meta property="og:url" content={canonical} />}
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
      </>
    )}

    <slot name="head" />
  </head>
  <body>
    <slot />
  </body>
</html>
```
