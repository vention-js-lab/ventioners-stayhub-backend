import { z } from 'zod';

const envConfigSchema = z.object({
  APP_PORT: z.coerce.number().int().positive(),
  ALLOWED_ORIGINS: z
    .string()
    .transform((s) => s.split(',').map((origin) => origin.trim().toLowerCase()))
    .pipe(z.array(z.string())),

  NODE_ENV: z.enum(['development', 'production', 'test']),

  DB_HOST: z.string(),
  DB_PORT: z.coerce.number().int().positive(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),

  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number().int().positive(),
  REDIS_PASSWORD: z.string(),

  MINIO_HOST: z.string(),
  MINIO_PORT: z.coerce.number().int().positive(),
  MINIO_CONSOLE_PORT: z.coerce.number().int().positive(),
  MINIO_ROOT_USER: z.string(),
  MINIO_ROOT_PASSWORD: z.string(),
  MINIO_REGION: z.string().optional(),

  AUTH_ACCESS_TOKEN_SECRET: z.string(),
  AUTH_ACCESS_TOKEN_EXPIRES_IN: z.string(),

  AUTH_REFRESH_TOKEN_SECRET: z.string(),
  AUTH_REFRESH_TOKEN_EXPIRES_IN: z.string(),

  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CLIENT_CALLBACK_URL: z.string(),
  GOOGLE_CLIENT_REDIRECT_URL: z.string(),
});

export type EnvConfig = z.infer<typeof envConfigSchema>;

export function validateEnv(config: unknown): EnvConfig {
  const parsedConfig = envConfigSchema.safeParse(config);

  if (!parsedConfig.success) {
    const errors = parsedConfig.error.errors.map((error) => {
      return {
        field: error.path.join('.'),
        message: error.message,
      };
    });

    throw new Error(`Config validation error: ${JSON.stringify(errors)}`);
  }

  return parsedConfig.data;
}
