'use client';

import { useState } from 'react';
import FileUploader from '@/components/FileUploader';
import UploadProgress from '@/components/UploadProgress';

export default function HomePage() {
  const [uploadState, setUploadState] = useState<{
    isUploading: boolean;
    progress: number;
    filename?: string;
    jobId?: string;
    error?: string;
  }>({
    isUploading: false,
    progress: 0,
  });

  const handleUploadStart = (filename: string) => {
    setUploadState({
      isUploading: true,
      progress: 0,
      filename,
    });
  };

  const handleUploadProgress = (progress: number) => {
    setUploadState((prev) => ({ ...prev, progress }));
  };

  const handleUploadComplete = (jobId: string) => {
    setUploadState((prev) => ({
      ...prev,
      isUploading: false,
      progress: 100,
      jobId,
    }));
  };

  const handleUploadError = (error: string) => {
    setUploadState((prev) => ({
      ...prev,
      isUploading: false,
      error,
    }));
  };

  const handleReset = () => {
    setUploadState({
      isUploading: false,
      progress: 0,
    });
  };

  return (
    <div className="animate-fadeIn">
      <div className="page-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="page-title">Upload Your Video</h1>
        <p className="page-subtitle">
          Transform your videos into multiple formats and resolutions with HLS streaming
        </p>
      </div>

      {uploadState.isUploading || uploadState.jobId ? (
        <UploadProgress
          filename={uploadState.filename || ''}
          progress={uploadState.progress}
          jobId={uploadState.jobId}
          error={uploadState.error}
          onReset={handleReset}
        />
      ) : (
        <FileUploader
          onUploadStart={handleUploadStart}
          onUploadProgress={handleUploadProgress}
          onUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
        />
      )}

      {/* Features Section */}
      <div style={{ marginTop: '4rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.5rem' }}>
          What We Offer
        </h2>
        <div className="job-grid">
          <FeatureCard
            title="Multi-Resolution"
            description="Automatic transcoding to 1080p, 720p, 480p, and 360p"
            icon="📐"
          />
          <FeatureCard
            title="HLS Streaming"
            description="Adaptive bitrate streaming for smooth playback"
            icon="📺"
          />
          <FeatureCard
            title="Thumbnails"
            description="Auto-generated poster and timeline thumbnails"
            icon="🖼️"
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="card">
      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{icon}</div>
      <h3 style={{ marginBottom: '0.5rem', fontWeight: 600 }}>{title}</h3>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{description}</p>
    </div>
  );
}
