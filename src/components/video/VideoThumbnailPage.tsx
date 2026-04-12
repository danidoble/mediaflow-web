import { useState } from 'react';
import { ToolPage } from '../ToolPage';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { extractThumbnail } from '../../lib/api';

export function VideoThumbnailPage() {
  const [timestamp, setTimestamp] = useState('00:00:01');

  return (
    <ToolPage
      title="Extract Thumbnail"
      description="Capture a single frame from a video at the specified timestamp and encode it as a lossless WebP image."
      acceptedFormats="MP4, WebM, MKV, MOV, AVI, MPEG, OGG, 3GPP"
      acceptMime="video/*"
      onSubmit={async (file) => {
        const res = await extractThumbnail(file, timestamp);
        return res.data.job_id;
      }}
      fields={
        <div className="space-y-1.5">
          <Label htmlFor="timestamp">Timestamp</Label>
          <Input
            id="timestamp"
            type="text"
            placeholder="00:00:01 or 1"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Accepts <code className="bg-muted px-1 rounded text-xs">HH:MM:SS</code> or decimal seconds. Default: 00:00:01
          </p>
        </div>
      }
    />
  );
}
