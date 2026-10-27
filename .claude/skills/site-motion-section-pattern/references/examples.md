<!-- mustard:generated at:2026-09-22T21:31:20.206Z -->

# Motion Section Pattern — real examples from this codebase

> Excerpts verbatim do working tree (linhas indicadas). Re-extrair se o arquivo mudar.

## List reveal with index stagger

Source: `src/components/Testimonials.tsx`

Lines 43-69

```tsx
        <div className="border-t border-border">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="grid gap-5 border-b border-border py-8 md:grid-cols-[0.65fr_1.35fr] md:gap-12 md:py-10"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                  Cliente {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-foreground">
                  {testimonial.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {testimonial.role}, {testimonial.company}
                </p>
              </div>
              <blockquote className="text-lg leading-relaxed text-foreground md:text-xl">
                “{testimonial.content}”
              </blockquote>
            </motion.div>
          ))}
        </div>
```

## Header reveal with viewport margin

Source: `src/components/Mission.tsx`

Lines 25-47

```tsx
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-12 max-w-3xl text-center md:mb-16"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <span className="ethos-eyebrow">Princípios da Ethos</span>
          </motion.div>

          <h2 className="ethos-heading mb-6">O que orienta o nosso trabalho</h2>
          <p className="ethos-copy">
            Trabalhamos com clareza sobre escopo, prazo, riscos e
            responsabilidades para manter relações profissionais e entregas
            consistentes.
          </p>
        </motion.div>
```

## Side reveal (x) + stagger list

Source: `src/components/Benefits.tsx`

Lines 49-109

```tsx
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative order-2 lg:order-1"
          >
            <div
              className="ethos-product-blob ethos-product-blob--deep -left-8 -top-8 h-56 w-72"
              aria-hidden="true"
            />
            <div
              className="ethos-product-blob ethos-product-blob--vivid -bottom-8 -right-5 h-48 w-64"
              aria-hidden="true"
            />
            <div className="ethos-product-card relative overflow-hidden border border-border bg-card">
              <div className="border-b border-border px-6 py-5">
                <p className="text-xs font-medium text-primary">
                  Sistema em operação
                </p>
                <h3 className="mt-2 text-[28px] font-semibold leading-[1.4] text-foreground">
                  {featuredProject.title}
                </h3>
              </div>
              <div className="aspect-[4/3] bg-white">
                <LazyImage
                  src={featuredProject.image}
                  alt={`Interface do projeto ${featuredProject.title}`}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="h-full w-full"
                  imgClassName="h-full w-full object-cover object-top"
                />
              </div>
            </div>
          </motion.div>

          <div className="order-1 border-t border-border lg:order-2">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="grid gap-3 border-b border-border py-6 sm:grid-cols-[3rem_1fr]"
              >
                <span className="pt-1 text-xs font-semibold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-xl font-semibold leading-[1.4] text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm leading-[1.6] text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
```

## Single block reveal wrapping a Radix accordion

Source: `src/components/FAQ.tsx`

Lines 24-30

```tsx
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-8"
        >
```

## Step swap with AnimatePresence mode="wait"

Source: `src/components/WizardSection.tsx`

Lines 241-253

```tsx
          {/* Content */}
          <div className="flex min-h-[360px] flex-col overflow-hidden border-y border-border bg-card p-6 md:p-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Profile */}
              {step === 1 && (
                <motion.div
                  key="s1"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col flex-1"
                >
```
