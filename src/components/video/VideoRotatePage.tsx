import { useState } from 'react';
import { ToolPage } from '../ToolPage';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Switch } from '../ui/switch';
import { rotateVideo } from '../../lib/api';

export function VideoRotatePage() {
  const [degrees, setDegrees] = useState('90');
  const [noTranscode, setNoTranscode] = useState(false);

  return (
    <ToolPage
      title="Rotate Video"
      description="Rotate a video 90°, 180°, or 270° clockwise. Use metadata-only mode (stream copy) for instant results without re-encoding."
      acceptedFormats="MP4, WebM, MKV, MOV, AVI, MPEG, OGG, 3GPP"
      acceptMime="video/*"
      onSubmit={async (file) => {
        const res = await rotateVideo(file, Number(degrees), noTranscode);
        return res.data.job_id;
      }}
      fields={
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Rotation angle</Label>
            <RadioGroup value={degrees} onValueChange={setDegrees} className="flex gap-4">
              {['90', '180', '270'].map((d) => (
                <div key={d} className="flex items-center gap-1.5">
                  <RadioGroupItem value={d} id={`deg-${d}`} />
                  <Label htmlFor={`deg-${d}`} className="cursor-pointer font-normal">
                    {d}°
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label htmlFor="no_transcode" className="text-sm font-medium">Metadata-only rotation</Label>
              <p className="text-xs text-muted-foreground">
                Stream copy — instant, but not supported by all players
              </p>
            </div>
            <Switch
              id="no_transcode"
              checked={noTranscode}
              onCheckedChange={setNoTranscode}
            />
          </div>
        </div>
      }
    />
  );
}
