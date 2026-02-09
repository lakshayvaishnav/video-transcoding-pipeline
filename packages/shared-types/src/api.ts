// Upload
export interface PresignUploadRequest {
  filename: string;
  contentType: string;
  size: number;
}
export interface PresignUploadResponse {
  uploadId: string;
  uploadUrl: string;
  objectKey: string;
  expiresIn: number;
}
