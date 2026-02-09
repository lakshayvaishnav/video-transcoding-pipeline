import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "../config.js";
const s3Client = new S3Client({
    endpoint: config.s3.endpoint,
    region: config.s3.region,
    credentials: {
        accessKeyId: config.s3.accessKey,
        secretAccessKey: config.s3.secretKey,
    },
    forcePathStyle: config.s3.forcePathStyle,
});
export async function generatePresignedUploadUrl(objectKey, contentType, expiresIn = 3600) {
    const command = new PutObjectCommand({
        Bucket: config.s3.bucketUploads,
        Key: objectKey,
        ContentType: contentType,
    });
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return {
        uploadUrl,
        objectKey,
        expiresIn,
    };
}
export async function generatePresignedDownloadUrl(bucket, objectKey, expiresIn = 3600) {
    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: objectKey,
    });
    return getSignedUrl(s3Client, command, { expiresIn });
}
export async function checkObjectExists(bucket, objectKey) {
    try {
        await s3Client.send(new HeadObjectCommand({
            Bucket: bucket,
            Key: objectKey,
        }));
        return true;
    }
    catch (error) {
        return false;
    }
}
export { s3Client };
//# sourceMappingURL=s3.js.map