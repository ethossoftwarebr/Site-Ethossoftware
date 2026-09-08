import { z } from "zod";

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(1500),
});

export const chatBodySchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(20),
});
