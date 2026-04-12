import { useState } from 'react';
import { BatchToolPage } from '../BatchToolPage';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { batchConvertToWebp } from '../../lib/api';

export function ImageBatchWebpPage() {
  const [quality, setQuality] = useState(80);
  const [lossless, setLossless] = useState(false);

  return (
    <BatchToolPage
      title="Batch Convert to WebP"
      description="Convert up to 20 images to WebP in a single request. One background job is created per file."
      acceptedFormats="JPEG, PNG, GIF, WebP, TIFF, BMP"
      acceptMime="image/*"
      maxFiles={20}
      onSubmit={async (files) => {
        const res = await batchConvertToWebp(files, quality, lossless);
        return res.data.jobs;
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
