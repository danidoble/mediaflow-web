import { useState } from 'react';
import { ToolPage } from '../ToolPage';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { trimVideo } from '../../lib/api';

export function VideoTrimPage() {
  const [startTime, setStartTime] = useState('00:00:10');
  const [endTime, setEndTime] = useState('00:01:00');

  return (
    <ToolPage
      title="Trim Video"
      description="Extract a clip between two timestamps using fast stream copy — no re-encoding. Accepts HH:MM:SS or decimal seconds."
      acceptedFormats="MP4, WebM, MKV, MOV, AVI, MPEG, OGG, 3GPP"
      acceptMime="video/*"
      onSubmit={async (file) => {
        const res = await trimVideo(file, startTime, endTime);
        return res.data.job_id;
      }}
      fields={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="start_time">Start time</Label>
              <Input
                id="start_time"
                type="text"
                placeholder="00:00:10 or 10"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="end_time">End time</Label>
              <Input
                id="end_time"
                type="text"
                placeholder="00:01:00 or 60"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Both fields accept <code className="bg-muted px-1 rounded text-xs">HH:MM:SS</code> or decimal seconds (e.g. <code className="bg-muted px-1 rounded text-xs">1.5</code>).
            End time must be after start time.
          </p>
        </div>
      }
    />
  );
}
