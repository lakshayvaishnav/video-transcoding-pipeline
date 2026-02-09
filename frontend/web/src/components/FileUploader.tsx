'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { Upload, FileVideo } from 'lucide-react';
import api from '@/lib/axios';
import { useAuthStore } from '@/stores/authStore';

interface FileUploaderProps {
  onUploadStart: (filename: string) => void;
  onUploadProgress: (progress: number) => void;
  onUploadComplete: (jobId: string) => void;
  onUploadError: (error: string) => void;
}

export default function FileUploader({
  onUploadStart,
  onUploadProgress,
  onUploadComplete,
  onUploadError,
}: FileUploaderProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Check if authenticated
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      onUploadStart(file.name);

      try {
        // Step 1: Get presigned URL
        const presignResponse = await api.post('/api/upload/presign', {
          filename: file.name,
          contentType: file.type,
          size: file.size,
        });

        const { uploadId, uploadUrl } = presignResponse.data;

        // Step 2: Upload directly to S3/MinIO (use native axios for S3)
        const axios = (await import('axios')).default;
        await axios.put(uploadUrl, file, {
          headers: {
            'Content-Type': file.type,
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              onUploadProgress(progress);
            }
          },
        });

        // Step 3: Notify backend that upload is complete
        await api.post(`/api/upload/${uploadId}/complete`);

        onUploadComplete(uploadId);
      } catch (error) {
        console.error('Upload error:', error);
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        if (axiosError.response?.status === 401) {
          router.push('/login');
          return;
        }
        onUploadError(axiosError.response?.data?.message || 'Upload failed');
      }
    },
    [onUploadStart, onUploadProgress, onUploadComplete, onUploadError, isAuthenticated, router]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 * 1024, // 10GB
  });

  return (
    <div {...getRootProps()} className={`upload-zone ${isDragActive ? 'drag-active' : ''}`}>
      <input {...getInputProps()} />
      <div className="upload-icon">
        {isDragActive ? <FileVideo size={64} /> : <Upload size={64} />}
      </div>
      <h3 className="upload-title">
        {isDragActive ? 'Drop your video here' : 'Drag & drop a video file'}
      </h3>
      <p className="upload-subtitle">or click to browse • MP4, MOV, AVI, MKV, WebM up to 10GB</p>
      {!isAuthenticated && (
        <p className="upload-auth-hint">You&apos;ll need to sign in to upload</p>
      )}
    </div>
  );
}
