import { describe, expect, it } from "vitest";
import { buildMessage, type WizardData } from "./wizard-message";

const baseData: WizardData = {
  profile: "empresa",
  segment: "Varejo / E-commerce",
  segmentCustom: "",
  stage: "escalando",
  objective: "Vender mais pelo digital",
  solutions: ["site", "ecommerce"],
  budget: "5k15k",
  name: "João",
};

describe("buildMessage", () => {
  it("translates stored values into customer-facing labels", () => {
    const message = buildMessage(baseData);

    expect(message).toContain("Tenho uma empresa");
    expect(message).toContain("Site Institucional, E-commerce");
    expect(message).toContain("R$ 5.000 – R$ 15.000");
    expect(message).toContain("*Meu nome:* João");
  });

  it("uses the custom segment instead of Outro", () => {
    const message = buildMessage({
      ...baseData,
      segment: "Outro",
      segmentCustom: "Energia solar",
    });

    expect(message).toContain("*Segmento/Contexto:* Energia solar");
    expect(message).not.toContain("*Segmento/Contexto:* Outro");
  });

  it("shows a safe fallback when no solution was selected", () => {
    const message = buildMessage({ ...baseData, solutions: [] });

    expect(message).toContain("Ainda não sei exatamente");
  });

  it("omits the optional name block when the name is empty", () => {
    const message = buildMessage({ ...baseData, name: "" });

    expect(message).not.toContain("*Meu nome:*");
  });
});
