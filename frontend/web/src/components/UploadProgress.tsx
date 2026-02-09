'use client';

import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface UploadProgressProps {
  filename: string;
  progress: number;
  jobId?: string;
  error?: string;
  onReset: () => void;
}

export default function UploadProgress({
  filename,
  progress,
  jobId,
  error,
  onReset,
}: UploadProgressProps) {
  const isComplete = progress === 100 && jobId;
  const hasError = !!error;

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        {hasError ? (
          <AlertCircle size={48} color="var(--color-error)" />
        ) : isComplete ? (
          <CheckCircle size={48} color="var(--color-success)" />
        ) : (
          <Loader2
            size={48}
            color="var(--color-accent)"
            className="animate-spin"
            style={{ animation: 'spin 1s linear infinite' }}
          />
        )}
        <div>
          <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
            {hasError ? 'Upload Failed' : isComplete ? 'Upload Complete!' : 'Uploading...'}
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{filename}</p>
        </div>
      </div>

      {!isComplete && !hasError && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Progress</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {hasError && (
        <div
          style={{
            padding: '1rem',
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
          }}
        >
          <p style={{ color: 'var(--color-error)', fontSize: '0.875rem' }}>{error}</p>
        </div>
      )}

      {isComplete && (
        <div
          style={{
            padding: '1rem',
            background: 'rgba(34, 197, 94, 0.1)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
          }}
        >
          <p
            style={{ color: 'var(--color-success)', fontSize: '0.875rem', marginBottom: '0.5rem' }}
          >
            Your video is being processed. This may take a few minutes.
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Job ID: {jobId}</p>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        {isComplete && (
          <a href={`/jobs/${jobId}`} className="btn btn-primary">
            View Job Status
          </a>
        )}
        <button onClick={onReset} className="btn btn-secondary">
          {isComplete ? 'Upload Another' : 'Cancel'}
        </button>
      </div>
    </div>
  );
}
