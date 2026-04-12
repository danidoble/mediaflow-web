import React from 'react';
import { AppShell } from './AppShell';
import { RequireAuth } from './AuthContext';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { MultiFileUploadZone } from './MultiFileUploadZone';
import { JobPolling } from './JobPolling';
import { Toaster } from './ui/sonner';
import { toast } from 'sonner';
import type { BatchJobItem } from '../types/api';

interface BatchToolPageProps {
  title: string;
  description: string;
  acceptedFormats: string;
  acceptMime: string;
  maxFiles?: number;
  fields: React.ReactNode;
  onSubmit: (files: File[]) => Promise<BatchJobItem[]>;
}

export function BatchToolPage({
  title,
  description,
  acceptedFormats,
  acceptMime,
  maxFiles = 20,
  fields,
  onSubmit,
}: BatchToolPageProps) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [jobs, setJobs] = React.useState<BatchJobItem[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error('Select at least one file.');
      return;
    }
    setLoading(true);
    setJobs([]);
    try {
      const result = await onSubmit(files);
      setJobs(result);
      toast.success(`${result.length} job${result.length > 1 ? 's' : ''} queued!`);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RequireAuth>
      <AppShell title={title}>
        <Toaster richColors />
        <p className="text-sm text-muted-foreground -mt-4 mb-6">{description}</p>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <MultiFileUploadZone
                  accept={acceptMime}
                  label="Drop files here or click to browse"
                  hint={`Accepted: ${acceptedFormats} · max ${maxFiles} files`}
                  maxFiles={maxFiles}
                  onFiles={setFiles}
                  files={files}
                  disabled={loading}
                />
                {fields}
                <Button type="submit" disabled={loading || files.length === 0} className="w-full gap-2">
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? 'Submitting…' : `Submit ${files.length > 0 ? files.length : ''} job${files.length !== 1 ? 's' : ''}`}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div key={job.job_id}>
                  <p className="text-xs text-muted-foreground mb-1 truncate">{job.filename}</p>
                  <JobPolling jobId={job.job_id} />
                </div>
              ))
            ) : (
              <div className="flex h-full min-h-40 items-center justify-center rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground">Job results will appear here</p>
              </div>
            )}
          </div>
        </div>
      </AppShell>
    </RequireAuth>
  );
}
