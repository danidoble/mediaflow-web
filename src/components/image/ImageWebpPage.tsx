import { useState } from 'react';
import { ToolPage } from '../ToolPage';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { convertToWebp } from '../../lib/api';

export function ImageWebpPage() {
  const [quality, setQuality] = useState(80);
  const [lossless, setLossless] = useState(false);

  return (
    <ToolPage
      title="Convert to WebP"
      description="Compress images to WebP using cwebp. Quality range 0–100; lower = smaller file. Enable lossless for pixel-perfect output."
      acceptedFormats="JPEG, PNG, GIF, WebP, TIFF, BMP"
      acceptMime="image/*"
      onSubmit={async (file) => {
        const res = await convertToWebp(file, quality, lossless);
        return res.data.job_id;
      }}
      fields={
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="quality">Quality</Label>
              <span className="text-sm font-mono text-muted-foreground">{quality}</span>
            </div>
            <Input
              id="quality"
              type="range"
              min={0}
              max={100}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              disabled={lossless}
              className="accent-primary h-2 cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              0 = smallest file, 100 = best quality. Default: 80
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label htmlFor="lossless" className="text-sm font-medium">Lossless compression</Label>
              <p className="text-xs text-muted-foreground">Quality setting is ignored when enabled</p>
            </div>
            <Switch
              id="lossless"
              checked={lossless}
              onCheckedChange={setLossless}
            />
          </div>
        </div>
      }
    />
  );
}
