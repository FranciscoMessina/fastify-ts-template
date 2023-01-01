import { config } from 'dotenv';
import { parseEnv } from 'znv';
import { z } from 'zod';

config();

export const Env = parseEnv(process.env, {
  PORT: z.number().default(3000),
  SESSION_KEY: z.string().default('50000asdasdasdasdasdasdasdasdasdsada'),
  SESSION_SECRET: z.string().default('50000asdasdasdasdasdasdasdasdasdsada'),
  SESSION_MAX_AGE: z.number().default(1.92e7),
  IS_PROD: {
    schema: z.boolean(),
    defaults: {
      production: true,
      _: false,
    },
  },

  POSTGRES_DB: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_HOST: z.string().default('localhost'),
  POSTGRES_PORT: z.number().default(5432),

  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.number().default(6379),
  REDIS_PASSWORD: z.string(),
});
