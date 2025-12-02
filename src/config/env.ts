import "dotenv/config";
import z from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  MONGO_USER: z.string(),
  MONGO_PASSWORD: z.string(),
  MONGO_PORT: z.coerce.number().default(27017),
  DATABASE: z.string().default("mongodb"),
  MONGO_HOST: z.string().default("localhost"),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default("7d"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Invalid environment variables:", _env.error.format());
  throw new Error("Invalid environment variables");
}

export const env = _env.data;
