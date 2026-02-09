'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/axios';
import VideoPlayer from '@/components/VideoPlayer';
import { CheckCircle, AlertCircle, Loader2, Download, ArrowLeft } from 'lucide-react';

interface Output {
  id: string;
  type: string;
  profileName?: string;
  resolution?: string;
  url: string;
  size?: number;
  duration?: number;
}

interface JobDetail {
  id: string;
  uploadId: string;
  filename: string;
  status: string;
  progress: number;
  profiles: string[];
  outputs: Output[];
  error?: { code: string; message: string };
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
}

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.id as string;

  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJob();
    const interval = setInterval(fetchJob, 3000);
    return () => clearInterval(interval);
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const response = await api.get(`/api/jobs/${jobId}`);
      setJob(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch job:', err);
      setError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const getHlsMasterPlaylist = () => {
    return job?.outputs.find((o) => o.type === 'HLS_MASTER')?.url;
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    if (mb < 1024) return `${mb.toFixed(1)} MB`;
    return `${(mb / 1024).toFixed(2)} GB`;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <AlertCircle size={48} color="var(--color-error)" style={{ margin: '0 auto 1rem' }} />
        <p style={{ color: 'var(--color-error)' }}>{error || 'Job not found'}</p>
        <a href="/jobs" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          Back to Jobs
        </a>
      </div>
    );
  }

  const hlsUrl = getHlsMasterPlaylist();

  return (
    <div className="animate-fadeIn">
      <a
        href="/jobs"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--color-text-secondary)',
          textDecoration: 'none',
          marginBottom: '1.5rem',
        }}
      >
        <ArrowLeft size={16} /> Back to Jobs
      </a>

      <div className="page-header">
        <h1 className="page-title">{job.filename}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
          <StatusBadge status={job.status} />
          {job.status === 'PROCESSING' && (
            <span style={{ color: 'var(--color-text-muted)' }}>{job.progress}%</span>
          )}
        </div>
      </div>

      {/* Video Player */}
      {job.status === 'COMPLETED' && hlsUrl && (
        <div style={{ marginBottom: '2rem' }}>
          <VideoPlayer src={hlsUrl} poster={job.outputs.find((o) => o.type === 'POSTER')?.url} />
        </div>
      )}

      {/* Processing State */}
      {(job.status === 'PROCESSING' || job.status === 'QUEUED') && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Loader2
              size={24}
              className="animate-spin"
              style={{ animation: 'spin 1s linear infinite', color: 'var(--color-accent)' }}
            />
            <span>Transcoding in progress...</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${job.progress}%` }} />
          </div>
        </div>
      )}

      {/* Error State */}
      {job.status === 'FAILED' && job.error && (
        <div
          className="card"
          style={{
            marginBottom: '2rem',
            borderColor: 'var(--color-error)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <AlertCircle size={24} color="var(--color-error)" />
            <span style={{ fontWeight: 600 }}>Transcoding Failed</span>
          </div>
          <p style={{ color: 'var(--color-text-secondary)' }}>{job.error.message}</p>
        </div>
      )}

      {/* Outputs */}
      {job.status === 'COMPLETED' && job.outputs.length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Available Downloads</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {job.outputs
              .filter((o) => o.type === 'MP4')
              .map((output) => (
                <div
                  key={output.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    background: 'var(--color-bg)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 500 }}>{output.profileName}</span>
                    <span style={{ color: 'var(--color-text-muted)', marginLeft: '0.5rem' }}>
                      {output.resolution}
                    </span>
                  </div>
                  <a
                    href={output.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost"
                    style={{ padding: '0.5rem 1rem' }}
                  >
                    <Download size={16} />
                    Download
                  </a>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const getConfig = () => {
    switch (status) {
      case 'COMPLETED':
        return { icon: <CheckCircle size={14} />, className: 'status-completed' };
      case 'FAILED':
        return { icon: <AlertCircle size={14} />, className: 'status-failed' };
      case 'PROCESSING':
      case 'QUEUED':
        return {
          icon: (
            <Loader2
              size={14}
              className="animate-spin"
              style={{ animation: 'spin 1s linear infinite' }}
            />
          ),
          className: 'status-processing',
        };
      default:
        return { icon: null, className: 'status-pending' };
    }
  };

  const { icon, className } = getConfig();

  return (
    <span className={`status-badge ${className}`}>
      {icon}
      {status}
    </span>
  );
}
