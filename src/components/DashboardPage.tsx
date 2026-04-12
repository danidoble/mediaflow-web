import React, { useEffect, useState } from 'react';
import { AppShell } from './AppShell';
import { RequireAuth, useAuth } from './AuthContext';
import { listJobs } from '../lib/api';
import { JobStatusBadge } from './JobStatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import {
  Image,
  Film,
  Layers,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import type { Job } from '../types/api';

const QUICK_ACTIONS = [
  { label: 'Convert to WebP', href: '/image/webp', icon: Image, color: 'text-blue-500' },
  { label: 'Convert to AVIF', href: '/image/avif', icon: Image, color: 'text-indigo-500' },
  { label: 'Resize Image', href: '/image/resize', icon: Layers, color: 'text-violet-500' },
  { label: 'Convert Video', href: '/video/convert', icon: Film, color: 'text-pink-500' },
  { label: 'Rotate Video', href: '/video/rotate', icon: Film, color: 'text-rose-500' },
  { label: 'Resize Video', href: '/video/resize', icon: Film, color: 'text-orange-500' },
  { label: 'Trim Video', href: '/video/trim', icon: Film, color: 'text-amber-500' },
  { label: 'Extract Thumbnail', href: '/video/thumbnail', icon: Film, color: 'text-green-500' },
];

function StatCard({
  label,
  value,
  icon: Icon,
  iconClass,
  loading,
}: {
  label: string;
  value: number;
  icon: React.FC<{ className?: string }>;
  iconClass: string;
  loading: boolean;
}) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div className={`rounded-lg p-2 bg-muted ${iconClass}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            {loading ? (
              <Skeleton className="h-6 w-10 mb-1" />
            ) : (
              <p className="text-2xl font-bold">{value}</p>
            )}
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listJobs({ page: 1, page_size: 50 })
      .then((r) => setJobs(r.data.items))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total = jobs.length;
  const completed = jobs.filter((j) => j.status === 'completed').length;
  const failed = jobs.filter((j) => j.status === 'failed').length;
  const running = jobs.filter((j) => j.status === 'pending' || j.status === 'started').length;
  const recent = jobs.slice(0, 8);

  return (
    <RequireAuth>
      <AppShell title="Dashboard">
        <p className="text-sm text-muted-foreground -mt-4 mb-6">
          Welcome back, <span className="font-medium text-foreground">{user?.email}</span>
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total jobs" value={total} icon={Layers} iconClass="text-primary" loading={loading} />
          <StatCard label="Completed" value={completed} icon={CheckCircle2} iconClass="text-green-600" loading={loading} />
          <StatCard label="Failed" value={failed} icon={XCircle} iconClass="text-destructive" loading={loading} />
          <StatCard label="In progress" value={running} icon={Clock} iconClass="text-amber-500" loading={loading} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick actions */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 pt-0">
              {QUICK_ACTIONS.map(({ label, href, icon: Icon, color }) => (
                <a
                  key={href}
                  href={href}
                  className="flex items-center gap-2.5 rounded-md px-2 py-2 text-sm hover:bg-muted transition-colors group"
                >
                  <Icon className={`h-4 w-4 shrink-0 ${color}`} />
                  <span className="flex-1">{label}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </CardContent>
          </Card>

          {/* Recent jobs */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">Recent jobs</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs h-7" asChild>
                <a href="/jobs">View all</a>
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              {loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-9 w-full" />
                  ))}
                </div>
              ) : recent.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Layers className="h-8 w-8 text-muted-foreground/40 mb-2" />
                  <p className="text-sm text-muted-foreground">No jobs yet.</p>
                  <p className="text-xs text-muted-foreground mt-1">Use a quick action to get started.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {recent.map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-muted/50 transition-colors"
                    >
                      <span className="font-mono text-xs text-muted-foreground w-20 shrink-0">
                        {job.id.slice(0, 8)}…
                      </span>
                      <Badge variant="outline" className="text-xs font-normal shrink-0">
                        {job.job_type.replace(/_/g, ' ')}
                      </Badge>
                      <span className="flex-1" />
                      <JobStatusBadge status={job.status} />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </AppShell>
    </RequireAuth>
  );
}
