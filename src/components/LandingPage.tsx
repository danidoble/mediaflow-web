import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import {
  Wand2,
  ImageIcon,
  Crop,
  FileVideo,
  RotateCcw,
  Scissors,
  Camera,
  Gauge,
  Zap,
  Shield,
  Clock,
  ArrowRight,
  Images,
  CheckCircle2,
  Layers,
} from 'lucide-react';

const FEATURES = [
  {
    icon: <Wand2 className="h-5 w-5" />,
    title: 'Convert to WebP',
    description: 'Compress images to WebP with quality control and optional lossless mode. Up to 35% smaller than JPEG.',
    badge: 'Image',
  },
  {
    icon: <ImageIcon className="h-5 w-5" />,
    title: 'Convert to AVIF',
    description: 'Next-gen AV1-based format. Best-in-class compression with superior visual quality.',
    badge: 'Image',
  },
  {
    icon: <Crop className="h-5 w-5" />,
    title: 'Resize Image',
    description: 'Scale to exact dimensions with cover, contain, or fill strategies while preserving aspect ratio.',
    badge: 'Image',
  },
  {
    icon: <Layers className="h-5 w-5" />,
    title: 'Convert to Format',
    description: 'Convert any image to PNG, JPG, GIF, BMP, TIFF, WebP, or AVIF with a single click.',
    badge: 'Image',
  },
  {
    icon: <Images className="h-5 w-5" />,
    title: 'Batch Processing',
    description: 'Convert up to 20 images at once to WebP, AVIF, or any format. Each file runs as an independent job.',
    badge: 'Batch',
  },
  {
    icon: <FileVideo className="h-5 w-5" />,
    title: 'Convert Video',
    description: 'Transcode any video to MP4, WebM, MKV, or MOV using H.264, H.265, VP9, or AV1 codecs.',
    badge: 'Video',
  },
  {
    icon: <RotateCcw className="h-5 w-5" />,
    title: 'Rotate Video',
    description: 'Rotate 90°, 180°, or 270° by re-encoding or via metadata-only stream copy for instant results.',
    badge: 'Video',
  },
  {
    icon: <Gauge className="h-5 w-5" />,
    title: 'Resize Video',
    description: 'Scale video resolution with aspect ratio preservation or exact dimension targeting.',
    badge: 'Video',
  },
  {
    icon: <Scissors className="h-5 w-5" />,
    title: 'Trim Video',
    description: 'Extract any clip with precise start/end timestamps via fast stream copy — no re-encoding needed.',
    badge: 'Video',
  },
  {
    icon: <Camera className="h-5 w-5" />,
    title: 'Extract Thumbnail',
    description: 'Capture any frame from a video as a lossless WebP image. Perfect for previews and covers.',
    badge: 'Video',
  },
];

const STEPS = [
  {
    step: '01',
    title: 'Upload your file',
    description: 'Drop an image or video into any tool. Formats validated by MIME type — no extension tricks.',
  },
  {
    step: '02',
    title: 'Job is queued',
    description: 'Your file is sent to FFmpeg/cwebp workers via Celery. You receive a job ID immediately.',
  },
  {
    step: '03',
    title: 'Poll for status',
    description: 'The UI polls automatically. Watch progress update in real time from pending → processing → completed.',
  },
  {
    step: '04',
    title: 'Download result',
    description: 'A presigned MinIO URL is generated. Download your converted file directly — no intermediate storage.',
  },
];

const HIGHLIGHTS = [
  { icon: <Zap className="h-4 w-4" />, label: 'Async processing — never blocks the UI' },
  { icon: <Shield className="h-4 w-4" />, label: 'JWT auth with auto token refresh' },
  { icon: <Clock className="h-4 w-4" />, label: 'Job history with pagination & filters' },
  { icon: <Layers className="h-4 w-4" />, label: 'Live health check for all services' },
];

function smoothScroll(e: React.MouseEvent<HTMLAnchorElement>) {
  const href = e.currentTarget.getAttribute('href');
  if (!href?.startsWith('#')) return;
  e.preventDefault();
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2 font-semibold">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
              MF
            </span>
            <span>MediaFlow</span>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" onClick={smoothScroll} className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" onClick={smoothScroll} className="hover:text-foreground transition-colors">How it works</a>
            <a href="/health" className="hover:text-foreground transition-colors">Status</a>
          </nav>
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

      <main>
        {/* Hero */}
        <section className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-24 pb-16 text-center">
          <Badge variant="secondary" className="mb-6 gap-1.5">
            <Zap className="h-3 w-3" />
            Powered by FFmpeg · Celery · MinIO
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Transform any media
            <br />
            <span className="text-primary">in seconds</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-8">
            Async image and video conversion at scale. Upload once, receive a job ID,
            download your result when it's ready. No waiting, no blocking.
          </p>

          {/* Highlight pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {HIGHLIGHTS.map((h) => (
              <div
                key={h.label}
                className="flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground"
              >
                <span className="text-primary">{h.icon}</span>
                {h.label}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="gap-2" asChild>
              <a href="/register">
                Start converting
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/health">Check API status</a>
            </Button>
          </div>

          {/* Mock terminal */}
          <div className="mt-16 mx-auto max-w-2xl rounded-xl border bg-card shadow-lg overflow-hidden text-left">
            <div className="flex items-center gap-1.5 border-b bg-muted/40 px-4 py-2.5">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-muted-foreground font-mono">mediaflow — jobs</span>
            </div>
            <div className="px-5 py-4 font-mono text-xs space-y-1.5">
              <p><span className="text-muted-foreground">POST</span> <span className="text-primary">/api/v1/image/convert/webp</span></p>
              <p className="text-muted-foreground">{'→ { "job_id": "a1b2c3d4...", "status": "pending" }'}</p>
              <p className="mt-2"><span className="text-muted-foreground">GET </span> <span className="text-primary">/api/v1/jobs/a1b2c3d4</span></p>
              <p className="text-muted-foreground">{'→ { "status": "started" }'}</p>
              <p><span className="text-muted-foreground">GET </span> <span className="text-primary">/api/v1/jobs/a1b2c3d4</span></p>
              <p>{'→ { "status": "'}<span className="text-green-500">completed</span>{'", "result_url": "https://..." }'}</p>
            </div>
          </div>
        </section>

        <Separator />

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Everything you need</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Eight specialized endpoints covering every common image and video operation.
              All async, all fast.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f) => (
              <Card key={f.title} className="hover:border-primary/40 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="p-2 rounded-md bg-primary/10 text-primary">{f.icon}</span>
                    <Badge variant="outline" className="text-xs">{f.badge}</Badge>
                  </div>
                  <CardTitle className="text-sm font-semibold mt-3">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* How it works */}
        <section id="how-it-works" className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-3">How it works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Four simple steps from upload to download.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.step} className="relative flex flex-col gap-3">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-5 left-full w-full h-px bg-border -translate-y-1/2 z-0" />
                )}
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-mono text-sm font-bold">
                    {s.step}
                  </span>
                </div>
                <h3 className="font-semibold text-sm">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Rate limits */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
          <div className="rounded-xl border bg-card p-6 sm:p-8">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Rate limits
            </h3>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              {[
                { scope: 'Image conversions & resize', limit: '30 req / min' },
                { scope: 'Video convert / rotate / resize / trim', limit: '10 req / min' },
                { scope: 'Video thumbnail', limit: '20 req / min' },
              ].map((r) => (
                <div key={r.scope} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-xs">{r.scope}</p>
                    <p className="text-muted-foreground text-xs">{r.limit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-24">
          <div className="rounded-2xl bg-primary text-primary-foreground p-10 sm:p-14 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              Ready to convert your first file?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto text-sm">
              Create a free account and submit your first job in under a minute.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="gap-2 font-semibold"
              asChild
            >
              <a href="/register">
                Create account
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} MediaFlow — Built with Astro, React, Tailwind v4 & shadcn/ui</p>
      </footer>
    </div>
  );
}
