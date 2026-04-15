import { z } from "zod";

const envSchema = z.object({
  AI_PROVIDER: z.enum(["ollama"]).default("ollama"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://127.0.0.1:3000"),
  NEXT_PUBLIC_DEFAULT_CITY: z.string().default("Helsinki"),
  OLLAMA_BASE_URL: z.string().url().default("http://127.0.0.1:11434")
});

export const env = envSchema.parse({
  AI_PROVIDER: process.env.AI_PROVIDER,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_DEFAULT_CITY: process.env.NEXT_PUBLIC_DEFAULT_CITY,
  OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL
});

