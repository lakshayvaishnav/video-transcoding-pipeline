import { z } from "zod";

const envSchema = z.object({
  // Server
  PORT: z.string().default("4000"),
  HOST: z.string().default("0.0.0.0"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),

  // Database
  DATABASE_URL: z.string(),

  // Redis
  REDIS_URL: z.string().default("redis://localhost:6379"),

  // Kafka
  KAFKA_BROKERS: z.string().default("localhost:19092"),

  // S3 / MinIO
  S3_ENDPOINT: z.string().optional(),
  S3_ACCESS_KEY: z.string(),
  S3_SECRET_KEY: z.string(),
  S3_BUCKET_UPLOADS: z.string().default("videos"),
  S3_BUCKET_OUTPUTS: z.string().default("transcoded"),
  S3_REGION: z.string().default("us-east-1"),
  S3_FORCE_PATH_STYLE: z.string().default("false"),

  // Auth
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("24h"),
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
    server: {
      port: parseInt(env.PORT, 10),
      host: env.HOST,
      nodeEnv: env.NODE_ENV,
      logLevel: env.LOG_LEVEL,
    },
    database: {
      url: env.DATABASE_URL,
    },
    redis: {
      url: env.REDIS_URL,
    },
    kafka: {
      brokers: env.KAFKA_BROKERS.split(","),
    },
    s3: {
      endpoint: env.S3_ENDPOINT,
      accessKey: env.S3_ACCESS_KEY,
      secretKey: env.S3_SECRET_KEY,
      bucketUploads: env.S3_BUCKET_UPLOADS,
      bucketOutputs: env.S3_BUCKET_OUTPUTS,
      region: env.S3_REGION,
      forcePathStyle: env.S3_FORCE_PATH_STYLE === "true",
    },
    auth: {
      jwtSecret: env.JWT_SECRET,
      jwtExpiresIn: env.JWT_EXPIRES_IN,
    },
  };
}

export const config = loadConfig();
export type Config = typeof config;
