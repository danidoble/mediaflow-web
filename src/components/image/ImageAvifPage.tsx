import { useState } from 'react';
import { ToolPage } from '../ToolPage';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { convertToAvif } from '../../lib/api';

export function ImageAvifPage() {
  const [quality, setQuality] = useState(60);

  return (
    <ToolPage
      title="Convert to AVIF"
      description="Convert images to AVIF using FFmpeg + libaom-av1. Quality range 0–63; 0 = lossless, 63 = lowest quality. CPU-intensive but best compression."
      acceptedFormats="JPEG, PNG, GIF, WebP, TIFF, BMP"
      acceptMime="image/*"
      onSubmit={async (file) => {
        const res = await convertToAvif(file, quality);
        return res.data.job_id;
      }}
      fields={
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="quality">Quality (AV1 CRF)</Label>
            <span className="text-sm font-mono text-muted-foreground">{quality}</span>
          </div>
          <Input
            id="quality"
            type="range"
            min={0}
            max={63}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="accent-primary h-2 cursor-pointer"
          />
          <p className="text-xs text-muted-foreground">
            0 = lossless, 63 = worst quality. Default: 60
          </p>
        </div>
      }
    />
  );
}
