import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import fs from 'fs';
import path from 'path';
import { config } from './config.js';
const s3Client = new S3Client({
    endpoint: config.s3.endpoint,
    region: config.s3.region,
    credentials: {
        accessKeyId: config.s3.accessKey,
        secretAccessKey: config.s3.secretKey,
    },
    forcePathStyle: config.s3.forcePathStyle,
});
export async function uploadOutputs(jobDir, outputPrefix, outputs, logger) {
    const bucket = config.s3.bucketOutputs;
    // Upload individual files based on outputs
    for (const output of outputs) {
        const localPath = getLocalPathForOutput(jobDir, output);
        if (!localPath)
            continue;
        // Check if it's a directory (HLS) or file
        const stat = await fs.promises.stat(localPath).catch(() => null);
        if (!stat) {
            logger.warn({ path: localPath }, 'Output file not found');
            continue;
        }
        if (stat.isDirectory()) {
            // Upload all files in directory (HLS segments)
            await uploadDirectory(localPath, output.path, bucket, logger);
        }
        else {
            // Upload single file
            await uploadFile(localPath, output.path, bucket, logger);
        }
    }
    // Also upload master playlist separately if exists
    const masterPath = path.join(jobDir, 'hls', 'master.m3u8');
    if (await fileExists(masterPath)) {
        await uploadFile(masterPath, `${outputPrefix}hls/master.m3u8`, bucket, logger);
    }
    // Upload HLS directories
    const hlsDir = path.join(jobDir, 'hls');
    if (await directoryExists(hlsDir)) {
        await uploadHlsDirectory(hlsDir, `${outputPrefix}hls`, bucket, logger);
    }
    // Upload thumbnails
    const thumbnailFiles = await fs.promises.readdir(jobDir).catch(() => []);
    for (const file of thumbnailFiles) {
        if (file.endsWith('.jpg')) {
            await uploadFile(path.join(jobDir, file), `${outputPrefix}${file}`, bucket, logger);
        }
    }
    logger.info({ bucket, prefix: outputPrefix }, 'All outputs uploaded');
}
function getLocalPathForOutput(jobDir, output) {
    if (output.type === 'mp4' && output.profileName) {
        return path.join(jobDir, `${output.profileName}.mp4`);
    }
    if (output.type === 'hls_variant' && output.profileName) {
        return path.join(jobDir, 'hls', output.profileName);
    }
    if (output.type === 'hls_master') {
        return path.join(jobDir, 'hls', 'master.m3u8');
    }
    if (output.type === 'poster' || output.type === 'thumbnail') {
        const filename = output.path.split('/').pop();
        return filename ? path.join(jobDir, filename) : null;
    }
    return null;
}
async function uploadFile(localPath, s3Key, bucket, logger) {
    const fileStream = fs.createReadStream(localPath);
    const contentType = getContentType(localPath);
    const upload = new Upload({
        client: s3Client,
        params: {
            Bucket: bucket,
            Key: s3Key,
            Body: fileStream,
            ContentType: contentType,
        },
    });
    await upload.done();
    logger.debug({ key: s3Key }, 'File uploaded');
}
async function uploadDirectory(localDir, s3Prefix, bucket, logger) {
    const files = await fs.promises.readdir(localDir);
    for (const file of files) {
        const localPath = path.join(localDir, file);
        const s3Key = `${s3Prefix}/${file}`;
        await uploadFile(localPath, s3Key, bucket, logger);
    }
}
async function uploadHlsDirectory(localDir, s3Prefix, bucket, logger) {
    const items = await fs.promises.readdir(localDir, { withFileTypes: true });
    for (const item of items) {
        const localPath = path.join(localDir, item.name);
        const s3Key = `${s3Prefix}/${item.name}`;
        if (item.isDirectory()) {
            await uploadHlsDirectory(localPath, s3Key, bucket, logger);
        }
        else {
            await uploadFile(localPath, s3Key, bucket, logger);
        }
    }
}
function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const types = {
        '.mp4': 'video/mp4',
        '.m3u8': 'application/vnd.apple.mpegurl',
        '.ts': 'video/MP2T',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
    };
    return types[ext] ?? 'application/octet-stream';
}
async function fileExists(filePath) {
    try {
        const stat = await fs.promises.stat(filePath);
        return stat.isFile();
    }
    catch {
        return false;
    }
}
async function directoryExists(dirPath) {
    try {
        const stat = await fs.promises.stat(dirPath);
        return stat.isDirectory();
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=uploader.js.map