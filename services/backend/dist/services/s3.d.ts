import { S3Client } from "@aws-sdk/client-s3";
declare const s3Client: S3Client;
export interface PresignedUploadResult {
    uploadUrl: string;
    objectKey: string;
    expiresIn: number;
}
export declare function generatePresignedUploadUrl(objectKey: string, contentType: string, expiresIn?: number): Promise<PresignedUploadResult>;
export declare function generatePresignedDownloadUrl(bucket: string, objectKey: string, expiresIn?: number): Promise<string>;
export declare function checkObjectExists(bucket: string, objectKey: string): Promise<boolean>;
export { s3Client };
//# sourceMappingURL=s3.d.ts.map