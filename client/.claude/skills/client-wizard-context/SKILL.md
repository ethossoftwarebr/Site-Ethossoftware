---
name: client-wizard-context
description: Use when adding or modifying a multi-step lead-capture wizard, generating a WhatsApp deep-link from form state, or extending the WizardSection / WhatsAppWizard components in the Ethos client. Triggers on "wizard step", "lead form", "whatsapp message", "multi-step form", "lead capture", "form wizard".
source: scan
---
<!-- mustard:generated -->

# Client Wizard Context

> The Ethos site has two related wizards that funnel into WhatsApp: an inline section (`WizardSection.tsx`) and a modal variant (`WhatsAppWizard.tsx`). Both share the same playbook.

## When to use

- Adding/removing/reordering steps in either wizard
- Adding a new question type (single-select, multi-select, free text)
- Branching the step flow based on a previous answer
- Updating the generated WhatsApp message template

## Architecture

| Concern | Implementation |
|---------|----------------|
| Step pointer | `useState<number>(1)` |
| Form data | Single `useState<WizardData>({...})` object updated functionally |
| Step gate | `canAdvance()` switch returning boolean |
| Conditional skipping | Custom `handleNext`/`handleBack` that jumps over inactive steps (`WizardSection.tsx:205`) |
| Step swap animation | `<AnimatePresence mode="wait">` with `motion.div` keyed on `step` |
| Final action | `window.open(\`https://wa.me/${NUMBER}?text=${encodeURIComponent(buildMessage(data))}\`)` |
| Reserved global control | `client/src/context/WizardContext.tsx:9` — `useWizard()` exists but is currently unused; reserved for future global open/close |

## Step skeleton

```tsx
{step === N && (
  <motion.div
    key={`s${N}`}
    initial={{ opacity: 0, x: 30 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -30 }}
    transition={{ duration: 0.25 }}
    className="flex flex-col flex-1"
  >
    <h3 className="text-xl font-bold text-foreground mb-1">Question?</h3>
    <p className="text-muted-foreground text-sm mb-5">Helper text.</p>
    {/* options */}
  </motion.div>
)}
```

## Adding a step (checklist)

1. Bump `TOTAL_STEPS` (`WizardSection.tsx:185`) — the modal version uses `steps.length`, so add to the `steps` array directly (`WhatsAppWizard.tsx:66` / `WizardSection.tsx:135`).
2. Add the field to the `WizardData` interface and the initial `useState`.
3. Add a `canAdvance()` branch.
4. Add the JSX block inside `<AnimatePresence mode="wait">`.
5. If conditional, follow the `showStageStep` skip logic (`WizardSection.tsx:206`).
6. Update `buildMessage(data)` to include the new field in the rendered template.
7. Add `data-testid` to every selectable option button.

## Branding

- Header: `bg-gradient-to-r from-[#531B8C] to-[#A229F2]` with white sparkles.
- Selected option: `border-[#A229F2] bg-[#A229F2]/10 text-[#531B8C]` + `<CheckCircle2 className="w-4 h-4 text-[#A229F2]" />`.
- Unselected option: `border-border` (or `border-gray-200` in modal) `hover:border-[#A229F2]/40 hover:bg-[#A229F2]/5`.
- Final send button: WhatsApp green `bg-[#25D366] hover:bg-[#128C7E] shadow-lg shadow-green-500/30`.

## References

- Inline section wizard (7 steps + branching): `client/src/components/WizardSection.tsx:171`
- Modal wizard (5 steps): `client/src/components/WhatsAppWizard.tsx:101`
- Global context (reserved): `client/src/context/WizardContext.tsx:9`
- `buildMessage()` template (inline): `client/src/components/WizardSection.tsx:145`
- Real code in `references/examples.md`.
