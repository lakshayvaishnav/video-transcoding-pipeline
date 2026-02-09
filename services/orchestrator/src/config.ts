import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  KAFKA_BROKERS: z.string().default("localhost:19092"),
  KAFKA_GROUP_ID: z.string().default("orchestrator-group"),
  S3_BUCKET_OUTPUTS: z.string().default("transcoded"),
});

function loadConfig() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Invalid environment variables:");
    console.error(result.error.format());
    process.exit(1);
  }

  const env = result.data;

  return {
    nodeEnv: env.NODE_ENV,
    logLevel: env.LOG_LEVEL,
    database: { url: env.DATABASE_URL },
    redis: { url: env.REDIS_URL },
    kafka: {
      brokers: env.KAFKA_BROKERS.split(","),
      groupId: env.KAFKA_GROUP_ID,
    },
    s3: {
      bucketOutputs: env.S3_BUCKET_OUTPUTS,
    },
  };
}

export const config = loadConfig();
