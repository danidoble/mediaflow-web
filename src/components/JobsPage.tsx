import React, { useEffect, useState } from 'react';
import { AppShell } from './AppShell';
import { RequireAuth } from './AuthContext';
import { listJobs, cancelJob } from '../lib/api';
import { JobStatusBadge } from './JobStatusBadge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import { Toaster } from './ui/sonner';
import { toast } from 'sonner';
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import type { Job, JobStatus, JobType } from '../types/api';

const ALL = '__all__';

const JOB_TYPE_LABELS: Record<string, string> = {
  image_convert_webp: 'Image → WebP',
  image_convert_avif: 'Image → AVIF',
  image_resize: 'Image Resize',
  video_convert: 'Video Convert',
  video_rotate: 'Video Rotate',
  video_resize: 'Video Resize',
  video_trim: 'Video Trim',
  video_thumbnail: 'Thumbnail',
};

export function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [typeFilter, setTypeFilter] = useState(ALL);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const PAGE_SIZE = 10;

  const fetchJobs = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await listJobs({
        page,
        page_size: PAGE_SIZE,
        ...(statusFilter !== ALL && { status: statusFilter as JobStatus }),
        ...(typeFilter !== ALL && { job_type: typeFilter as JobType }),
      });
      setJobs(res.data.items);
      setTotal(res.data.total);
    } catch {
      toast.error('Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, typeFilter]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleCancel = async (id: string) => {
    setCancelling(id);
    try {
      await cancelJob(id);
      toast.success('Job cancelled.');
      fetchJobs();
    } catch {
      toast.error('Could not cancel job.');
    } finally {
      setCancelling(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleFilterChange = (setter: (v: string) => void) => (val: string) => {
    setter(val);
    setPage(1);
  };

  return (
    <RequireAuth>
      <AppShell title="Jobs">
        <Toaster richColors />
        <p className="text-sm text-muted-foreground -mt-4 mb-6">
          Monitor and manage all your processing jobs.
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <Select value={statusFilter} onValueChange={handleFilterChange(setStatusFilter)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All statuses</SelectItem>
              {(['pending', 'started', 'completed', 'failed', 'cancelled'] as JobStatus[]).map(
                (s) => (
                  <SelectItem key={s} value={s} className="capitalize">
                    {s}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={handleFilterChange(setTypeFilter)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All types</SelectItem>
              {Object.entries(JOB_TYPE_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={fetchJobs} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>

          <span className="ml-auto self-center text-sm text-muted-foreground">
            {total} job{total !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Table */}
        <div className="rounded-lg border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">ID</th>
                <th className="px-4 py-3 text-left font-medium">Type</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Created</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b last:border-0">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <Skeleton className="h-4 w-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                : jobs.length === 0
                  ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                        No jobs found.
                      </td>
                    </tr>
                  )
                  : jobs.map((job) => (
                      <tr key={job.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs">{job.id.slice(0, 8)}…</td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="text-xs font-normal">
                            {JOB_TYPE_LABELS[job.job_type] ?? job.job_type}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <JobStatusBadge status={job.status} />
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(job.created_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {job.result_url && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                asChild
                              >
                                <a href={job.result_url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              disabled={
                                cancelling === job.id ||
                                job.status === 'completed' ||
                                job.status === 'failed' ||
                                job.status === 'cancelled'
                              }
                              onClick={() => handleCancel(job.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </AppShell>
    </RequireAuth>
  );
}
