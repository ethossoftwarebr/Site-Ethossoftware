import { describe, expect, it } from "vitest";
import { chatBodySchema, chatMessageSchema } from "./chat-schema";

describe("chat schemas", () => {
  it("accepts a valid conversation", () => {
    const result = chatBodySchema.safeParse({
      messages: [
        { role: "user", content: "Olá" },
        { role: "assistant", content: "Como posso ajudar?" },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("rejects unsupported roles", () => {
    const result = chatMessageSchema.safeParse({ role: "system", content: "teste" });

    expect(result.success).toBe(false);
  });

  it("rejects empty content", () => {
    const result = chatMessageSchema.safeParse({ role: "user", content: "" });

    expect(result.success).toBe(false);
  });

  it("limits a conversation to twenty messages", () => {
    const result = chatBodySchema.safeParse({
      messages: Array.from({ length: 21 }, () => ({ role: "user", content: "teste" })),
    });

    expect(result.success).toBe(false);
  });
});
