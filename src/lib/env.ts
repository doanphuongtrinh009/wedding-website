import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  CLERK_SECRET_KEY: z.string().min(1),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1)
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1)
});

type ServerEnv = z.infer<typeof serverEnvSchema>;
type ClientEnv = z.infer<typeof clientEnvSchema>;

let cachedServerEnv: ServerEnv | null = null;
let cachedClientEnv: ClientEnv | null = null;

function getServerEnv() {
  if (cachedServerEnv) {
    return cachedServerEnv;
  }

  const result = serverEnvSchema.safeParse(process.env);

  if (!result.success) {
    throw new Error(
      `Invalid server environment variables: ${result.error.message}`
    );
  }

  cachedServerEnv = result.data;
  return cachedServerEnv;
}

function getClientEnv() {
  if (cachedClientEnv) {
    return cachedClientEnv;
  }

  const result = clientEnvSchema.safeParse(process.env);

  if (!result.success) {
    throw new Error(
      `Invalid client environment variables: ${result.error.message}`
    );
  }

  cachedClientEnv = result.data;
  return cachedClientEnv;
}

export const env = {
  server: getServerEnv,
  client: getClientEnv
};
