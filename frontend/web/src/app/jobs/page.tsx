'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface Job {
  id: string;
  uploadId: string;
  filename: string;
  status: string;
  progress: number;
  createdAt: string;
  finishedAt?: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchJobs, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/api/jobs');
      setJobs(response.data.jobs);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle size={16} />;
      case 'FAILED':
        return <AlertCircle size={16} />;
      case 'PROCESSING':
      case 'QUEUED':
        return (
          <Loader2
            size={16}
            className="animate-spin"
            style={{ animation: 'spin 1s linear infinite' }}
          />
        );
      default:
        return <Clock size={16} />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'status-completed';
      case 'FAILED':
        return 'status-failed';
      case 'PROCESSING':
      case 'QUEUED':
        return 'status-processing';
      default:
        return 'status-pending';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title">My Videos</h1>
        <p className="page-subtitle">View and manage your transcoding jobs</p>
      </div>

      {error && (
        <div
          style={{
            padding: '1rem',
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '2rem',
            color: 'var(--color-error)',
          }}
        >
          {error}
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>No videos yet</p>
          <a href="/" className="btn btn-primary">
            Upload Your First Video
          </a>
        </div>
      ) : (
        <div className="job-grid">
          {jobs.map((job) => (
            <a
              key={job.id}
              href={`/jobs/${job.id}`}
              className="job-card"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="job-thumbnail">
                <span style={{ fontSize: '3rem' }}>🎬</span>
              </div>
              <div className="job-info">
                <h3 className="job-title">{job.filename}</h3>
                <div className="job-meta">
                  <span className={`status-badge ${getStatusClass(job.status)}`}>
                    {getStatusIcon(job.status)}
                    {job.status}
                  </span>
                  <span>{formatDate(job.createdAt)}</span>
                </div>
                {job.status === 'PROCESSING' && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <div className="progress-bar" style={{ height: '4px' }}>
                      <div className="progress-bar-fill" style={{ width: `${job.progress}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
