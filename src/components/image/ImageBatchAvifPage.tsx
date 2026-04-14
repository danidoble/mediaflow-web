import { useState } from 'react';
import { BatchToolPage } from '../BatchToolPage';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { batchConvertToAvif } from '../../lib/api';
import { NotifyEmailField } from '../NotifyEmailField';

export function ImageBatchAvifPage() {
  const [quality, setQuality] = useState(60);
  const [notifyEmail, setNotifyEmail] = useState<string | undefined>();

  return (
    <BatchToolPage
      title="Batch Convert to AVIF"
      description="Convert up to 20 images to AVIF in a single request using FFmpeg libaom-av1. One background job is created per file."
      acceptedFormats="JPEG, PNG, GIF, WebP, TIFF, BMP"
      acceptMime="image/*"
      maxFiles={20}
      onSubmit={async (files) => {
        const res = await batchConvertToAvif(files, quality, notifyEmail);
        return res.data.jobs;
      }}
      fields={
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="quality">Quality (AV1 CQ)</Label>
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

          <NotifyEmailField onChange={setNotifyEmail} />
        </div>
      }
    />
  );
}
