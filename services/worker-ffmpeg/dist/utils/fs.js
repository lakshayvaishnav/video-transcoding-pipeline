import fs from 'fs/promises';
import path from 'path';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { config } from '../config.js';
const s3Client = new S3Client({
    endpoint: config.s3.endpoint,
    region: config.s3.region,
    credentials: {
        accessKeyId: config.s3.accessKey,
        secretAccessKey: config.s3.secretKey,
    },
    forcePathStyle: config.s3.forcePathStyle,
});
export async function ensureTempDir(dir) {
    await fs.mkdir(dir, { recursive: true });
}
export async function cleanupTempDir(dir) {
    try {
        await fs.rm(dir, { recursive: true, force: true });
    }
    catch {
        // Ignore cleanup errors
    }
}
export async function downloadSourceFile(bucket, key, outputDir, logger) {
    await fs.mkdir(outputDir, { recursive: true });
    const filename = path.basename(key);
    const outputPath = path.join(outputDir, `source_${filename}`);
    logger.info({ bucket, key, outputPath }, 'Downloading source file');
    const response = await s3Client.send(new GetObjectCommand({
        Bucket: bucket,
        Key: key,
    }));
    if (!response.Body) {
        throw new Error('Empty response body from S3');
    }
    const writeStream = createWriteStream(outputPath);
    await pipeline(response.Body, writeStream);
    const stats = await fs.stat(outputPath);
    logger.info({ outputPath, size: stats.size }, 'Source file downloaded');
    return outputPath;
}
//# sourceMappingURL=fs.js.map