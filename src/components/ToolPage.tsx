import React from 'react';
import { AppShell } from './AppShell';
import { RequireAuth } from './AuthContext';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { FileUploadZone } from './FileUploadZone';
import { JobPolling } from './JobPolling';
import { Toaster } from './ui/sonner';
import { toast } from 'sonner';

interface ToolPageProps {
  title: string;
  description: string;
  acceptedFormats: string;
  acceptMime: string;
  fields: React.ReactNode;
  onSubmit: (file: File) => Promise<string>;
}

interface ToolPageState {
  file: File | null;
  loading: boolean;
  jobId: string | null;
}

export function ToolPage({
  title,
  description,
  acceptedFormats,
  acceptMime,
  fields,
  onSubmit,
}: ToolPageProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [jobId, setJobId] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file first.');
      return;
    }
    setLoading(true);
    setJobId(null);
    try {
      const id = await onSubmit(file);
      setJobId(id);
      toast.success('Job queued successfully!');
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
                <FileUploadZone
                  accept={acceptMime}
                  label={`Drop file here or click to browse`}
                  hint={`Accepted: ${acceptedFormats}`}
                  onFile={setFile}
                  file={file}
                  disabled={loading}
                />
                {fields}
                <Button type="submit" disabled={loading || !file} className="w-full gap-2">
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? 'Submitting…' : 'Submit job'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {jobId ? (
              <JobPolling jobId={jobId} />
            ) : (
              <div className="flex h-full min-h-40 items-center justify-center rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground">Job status will appear here</p>
              </div>
            )}
          </div>
        </div>
      </AppShell>
    </RequireAuth>
  );
}
