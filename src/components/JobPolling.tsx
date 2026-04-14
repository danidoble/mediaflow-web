import { useEffect, useRef, useState } from 'react';
import { getJob } from '../lib/api';
import type { Job } from '../types/api';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  CheckCircle,
  XCircle,
  Loader2,
  Clock,
  Download,
  Ban,
} from 'lucide-react';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  started: 'Processing',
  completed: 'Completed',
  failed: 'Failed',
  cancelled: 'Cancelled',
};

const STATUS_VARIANT: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  pending: 'secondary',
  started: 'default',
  completed: 'default',
  failed: 'destructive',
  cancelled: 'outline',
};

interface JobPollingProps {
  jobId: string;
  onDone?: (job: Job) => void;
}

export function JobPolling({ jobId, onDone }: JobPollingProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dots, setDots] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!jobId) return;

    const poll = async () => {
      try {
        const res = await getJob(jobId);
        setJob(res.data);
        if (
          res.data.status === 'completed' ||
          res.data.status === 'failed' ||
          res.data.status === 'cancelled'
        ) {
          clearInterval(intervalRef.current!);
          onDone?.(res.data);
        }
      } catch (e) {
        setError((e as Error).message);
        clearInterval(intervalRef.current!);
      }
    };

    poll();
    intervalRef.current = setInterval(poll, 3000);

    const dotInterval = setInterval(() => setDots((d) => (d + 1) % 4), 500);

    return () => {
      clearInterval(intervalRef.current!);
      clearInterval(dotInterval);
    };
  }, [jobId]);

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        <XCircle className="h-4 w-4 shrink-0" />
        {error}
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Fetching job status{'.'.repeat(dots)}
      </div>
    );
  }

  const isActive = job.status === 'pending' || job.status === 'started';
  const isCompleted = job.status === 'completed';
  const isFailed = job.status === 'failed';

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {isActive && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
          {isCompleted && <CheckCircle className="h-4 w-4 text-green-500" />}
          {isFailed && <XCircle className="h-4 w-4 text-destructive" />}
          {job.status === 'cancelled' && <Ban className="h-4 w-4 text-muted-foreground" />}
          {job.status === 'pending' && !isActive && <Clock className="h-4 w-4 text-muted-foreground" />}
          <span className="text-sm font-medium">Job {job.id.slice(0, 8)}…</span>
        </div>
        <Badge variant={STATUS_VARIANT[job.status] ?? 'secondary'}>
          {STATUS_LABELS[job.status] ?? job.status}
        </Badge>
      </div>

      {isActive && (
        <div className="space-y-1">
          <Progress
            value={
              job.status === 'started'
                ? (job.progress != null ? job.progress : 10)
                : 5
            }
            className="h-1.5"
          />
          {job.status === 'started' && job.progress != null && (
            <p className="text-xs text-muted-foreground text-right">{job.progress}%</p>
          )}
        </div>
      )}

      {isFailed && job.error && (
        <p className="text-xs text-destructive">{job.error}</p>
      )}

      {isCompleted && job.result_expired && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-300/50 bg-amber-50/50 dark:bg-amber-950/20 p-3 text-sm text-amber-700 dark:text-amber-400">
          <Clock className="h-4 w-4 shrink-0" />
          This media has expired and is no longer available.
        </div>
      )}

      {isCompleted && job.result_url && !job.result_expired && (
        <Button asChild size="sm" className="gap-2">
          <a href={job.result_url} target="_blank" rel="noreferrer" download>
            <Download className="h-4 w-4" />
            Download result
          </a>
        </Button>
      )}

      <p className="text-xs text-muted-foreground">
        Last updated: {new Date(job.updated_at).toLocaleString()}
      </p>
    </div>
  );
}
