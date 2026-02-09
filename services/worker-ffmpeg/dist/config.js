import { z } from 'zod';
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
    KAFKA_BROKERS: z.string().default('localhost:19092'),
    KAFKA_GROUP_ID: z.string().default('worker-ffmpeg-group'),
    S3_ENDPOINT: z.string().optional(),
    S3_ACCESS_KEY: z.string(),
    S3_SECRET_KEY: z.string(),
    S3_BUCKET_UPLOADS: z.string().default('videos'),
    S3_BUCKET_OUTPUTS: z.string().default('transcoded'),
    S3_REGION: z.string().default('us-east-1'),
    S3_FORCE_PATH_STYLE: z.string().default('false'),
    TEMP_DIR: z.string().default('/tmp/transcode'),
    MAX_RETRIES: z.coerce.number().default(3),
    FFMPEG_PATH: z.string().optional(),
    FFPROBE_PATH: z.string().optional(),
});
function loadConfig() {
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
        console.error('❌ Invalid environment variables:');
        console.error(result.error.format());
        process.exit(1);
    }
    const env = result.data;
    return {
        nodeEnv: env.NODE_ENV,
        logLevel: env.LOG_LEVEL,
        kafka: {
            brokers: env.KAFKA_BROKERS.split(','),
            groupId: env.KAFKA_GROUP_ID,
        },
        s3: {
            endpoint: env.S3_ENDPOINT,
            accessKey: env.S3_ACCESS_KEY,
            secretKey: env.S3_SECRET_KEY,
            bucketUploads: env.S3_BUCKET_UPLOADS,
            bucketOutputs: env.S3_BUCKET_OUTPUTS,
            region: env.S3_REGION,
            forcePathStyle: env.S3_FORCE_PATH_STYLE === 'true',
        },
        tempDir: env.TEMP_DIR,
        maxRetries: env.MAX_RETRIES,
        ffmpeg: {
            path: env.FFMPEG_PATH,
            probePath: env.FFPROBE_PATH,
        },
    };
}
export const config = loadConfig();
//# sourceMappingURL=config.js.map