import { useState } from 'react';
import { ToolPage } from '../ToolPage';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { resizeImage } from '../../lib/api';
import { NotifyEmailField } from '../NotifyEmailField';

export function ImageResizePage() {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [fit, setFit] = useState('cover');
  const [notifyEmail, setNotifyEmail] = useState<string | undefined>();

  return (
    <ToolPage
      title="Resize Image"
      description="Scale an image to target dimensions using FFmpeg. At least one of width or height is required. Choose a fit strategy to control how the image fills the target rectangle."
      acceptedFormats="JPEG, PNG, GIF, WebP, TIFF, BMP"
      acceptMime="image/*"
      onSubmit={async (file) => {
        const res = await resizeImage(file, {
          width: width ? Number(width) : undefined,
          height: height ? Number(height) : undefined,
          fit,
          notify_email: notifyEmail,
        });
        return res.data.job_id;
      }}
      fields={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="width">Width (px)</Label>
              <Input
                id="width"
                type="number"
                min={1}
                placeholder="e.g. 1280"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="height">Height (px)</Label>
              <Input
                id="height"
                type="number"
                min={1}
                placeholder="e.g. 720"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground -mt-2">
            Omit one dimension for proportional scaling.
          </p>

          <div className="space-y-2">
            <Label>Fit strategy</Label>
            <RadioGroup value={fit} onValueChange={setFit} className="space-y-1">
              {[
                { value: 'cover', label: 'Cover', desc: 'Crop to fill exactly — no letterbox' },
                { value: 'contain', label: 'Contain', desc: 'Scale to fit with letterboxing' },
                { value: 'fill', label: 'Fill', desc: 'Stretch to exact dimensions' },
              ].map((opt) => (
                <div key={opt.value} className="flex items-start gap-2">
                  <RadioGroupItem value={opt.value} id={`fit-${opt.value}`} className="mt-0.5" />
                  <Label htmlFor={`fit-${opt.value}`} className="cursor-pointer font-normal leading-snug">
                    <span className="font-medium">{opt.label}</span>
                    <span className="text-muted-foreground ml-1 text-xs">— {opt.desc}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <NotifyEmailField onChange={setNotifyEmail} />
        </div>
      }
    />
  );
}
