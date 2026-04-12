import { Badge } from './ui/badge';
import type { JobStatus } from '../types/api';

const CONFIG: Record<JobStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pending', variant: 'secondary' },
  started: { label: 'Processing', variant: 'default' },
  completed: { label: 'Completed', variant: 'default' },
  failed: { label: 'Failed', variant: 'destructive' },
  cancelled: { label: 'Cancelled', variant: 'outline' },
};

export function JobStatusBadge({ status }: { status: JobStatus }) {
  const { label, variant } = CONFIG[status] ?? { label: status, variant: 'secondary' };
  return (
    <Badge
      variant={variant}
      className={
        status === 'completed'
          ? 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400'
          : undefined
      }
    >
      {label}
    </Badge>
  );
}
