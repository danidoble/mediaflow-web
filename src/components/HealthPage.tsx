import { useEffect, useState } from 'react';
import { AppShell } from './AppShell';
import { ThemeToggle } from './ThemeToggle';
import { isAuthenticated } from '../lib/auth';
import { getHealth } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { Toaster } from './ui/sonner';
import { toast } from 'sonner';
import {
  Database,
  Server,
  HardDrive,
  Film,
  Image,
  Mail,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import type { HealthData } from '../types/api';

const BASE_URL = import.meta.env.PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

const SERVICE_META: {
  key: keyof HealthData;
  label: string;
  icon: React.FC<{ className?: string }>;
  description: string;
}[] = [
  {
    key: 'database',
    label: 'PostgreSQL',
    icon: Database,
    description: 'Relational database for user and job records',
  },
  {
    key: 'redis',
    label: 'Redis',
    icon: Server,
    description: 'Message broker for the job queue',
  },
  {
    key: 'minio',
    label: 'MinIO',
    icon: HardDrive,
    description: 'S3-compatible object storage for processed files',
  },
  {
    key: 'ffmpeg',
    label: 'FFmpeg',
    icon: Film,
    description: 'Video & audio transcoding engine',
  },
  {
    key: 'cwebp',
    label: 'cwebp',
    icon: Image,
    description: 'WebP encoder from Google libwebp',
  },
  {
    key: 'email',
    label: 'Email / SMTP',
    icon: Mail,
    description: 'Job-completion notification emails via SMTP',
  },
];

function HealthContent() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const check = async () => {
    setLoading(true);
    try {
      const res = await getHealth();
      setHealth(res.data);
      setLastChecked(new Date());
    } catch {
      toast.error('Could not reach the API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    check();
  }, []);

  const allOk = health && Object.entries(health).every(([, v]) => v === 'ok' || v === 'not configured');
  const coreOk = health && Object.entries(health)
    .filter(([k]) => k !== 'email')
    .every(([, v]) => v === 'ok');

  const inner = (
    <>
      <Toaster richColors />
      <div className="flex items-center gap-3 -mt-4 mb-6">
        <p className="text-sm text-muted-foreground flex-1">
          Live status of all services powering the MediaFlow API.
        </p>
        <Button variant="outline" size="sm" onClick={check} disabled={loading} className="gap-2">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Overall status banner */}
      {health && (
        <div
          className={`flex items-center gap-3 rounded-lg border px-4 py-3 mb-6 text-sm ${
            coreOk
              ? 'border-green-500/30 bg-green-500/5 text-green-700 dark:text-green-400'
              : 'border-destructive/30 bg-destructive/5 text-destructive'
          }`}
        >
          {coreOk ? (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          ) : (
            <XCircle className="h-5 w-5 shrink-0" />
          )}
          <div>
            <p className="font-medium">{coreOk ? 'All systems operational' : 'Degraded service'}</p>
            {lastChecked && (
              <p className="text-xs opacity-70 mt-0.5">Last checked: {lastChecked.toLocaleTimeString()}</p>
            )}
          </div>
        </div>
      )}

      {/* Service cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {SERVICE_META.map(({ key, label, icon: Icon, description }) => {
          const status = health?.[key];
          const ok = status === 'ok';
          const optional = status === 'not configured';

          return (
            <Card key={key}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  {label}
                  {loading ? (
                    <Skeleton className="h-4 w-12 ml-auto" />
                  ) : (
                    <Badge
                      variant="outline"
                      className={`ml-auto text-xs ${
                        ok
                          ? 'border-green-500/40 text-green-600 dark:text-green-400'
                          : optional
                          ? 'border-amber-500/40 text-amber-600 dark:text-amber-400'
                          : 'border-destructive/40 text-destructive'
                      }`}
                    >
                      {ok ? 'OK' : optional ? 'not configured' : (status ?? 'error')}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* API info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">API endpoint</CardTitle>
        </CardHeader>
        <CardContent>
          <code className="text-sm bg-muted px-2 py-1 rounded">{BASE_URL}/api/v1</code>
          <p className="text-xs text-muted-foreground mt-2">
            Configured via <code className="bg-muted px-1 rounded">PUBLIC_API_BASE_URL</code> environment variable.
          </p>
        </CardContent>
      </Card>
    </>
  );

  if (isAuthenticated()) {
    return <AppShell title="System Health">{inner}</AppShell>;
  }

  // Public view — no sidebar, minimal shell
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="/" className="flex items-center gap-2 font-semibold text-foreground">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
              MF
            </span>
            <span>MediaFlow</span>
          </a>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild>
              <a href="/login">Sign in</a>
            </Button>
            <Button size="sm" asChild>
              <a href="/register">Get started</a>
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-bold tracking-tight mb-1">System Health</h1>
        {inner}
      </main>
    </div>
  );
}

export function HealthPage() {
  return <HealthContent />;
}
