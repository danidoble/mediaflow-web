import { useState } from 'react';
import { ToolPage } from '../ToolPage';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { resizeVideo } from '../../lib/api';
import { NotifyEmailField } from '../NotifyEmailField';

export function VideoResizePage() {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [keepAspect, setKeepAspect] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState<string | undefined>();

  return (
    <ToolPage
      title="Resize Video"
      description="Scale a video to target dimensions using FFmpeg. At least one of width or height is required."
      acceptedFormats="MP4, WebM, MKV, MOV, AVI, MPEG, OGG, 3GPP"
      acceptMime="video/*"
      onSubmit={async (file) => {
        const res = await resizeVideo(file, {
          width: width ? Number(width) : undefined,
          height: height ? Number(height) : undefined,
          keep_aspect: keepAspect,
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

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label htmlFor="keep_aspect" className="text-sm font-medium">Keep aspect ratio</Label>
              <p className="text-xs text-muted-foreground">
                Disable to stretch to exact dimensions
              </p>
            </div>
            <Switch
              id="keep_aspect"
              checked={keepAspect}
              onCheckedChange={setKeepAspect}
            />
          </div>

          <NotifyEmailField onChange={setNotifyEmail} />
        </div>
      }
    />
  );
}
