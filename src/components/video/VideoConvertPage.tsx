import { useEffect, useState } from 'react';
import { ToolPage } from '../ToolPage';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { useAuth } from '../AuthContext';
import { convertVideo, getHealth } from '../../lib/api';

const CODEC_FORMAT: Record<string, string> = {
  libx264: 'mp4',
  libx265: 'mp4',
  'libvpx-vp9': 'webm',
  'libaom-av1': 'mkv',
};

export function VideoConvertPage() {
  const { user } = useAuth();
  const [codec, setCodec] = useState('libx264');
  const [outputFormat, setOutputFormat] = useState('mp4');
  const [crf, setCrf] = useState(23);
  const [preset, setPreset] = useState('medium');
  const [notifyEnabled, setNotifyEnabled] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [emailConfigured, setEmailConfigured] = useState(false);

  useEffect(() => {
    getHealth()
      .then((res) => setEmailConfigured(res.data.email === 'ok'))
      .catch(() => setEmailConfigured(false));
  }, []);

  const handleCodecChange = (val: string) => {
    setCodec(val);
    setOutputFormat(CODEC_FORMAT[val] ?? 'mp4');
  };

  const handleNotifyToggle = (checked: boolean) => {
    setNotifyEnabled(checked);
    if (checked && !notifyEmail && user?.email) {
      setNotifyEmail(user.email);
    }
  };

  return (
    <ToolPage
      title="Convert Video"
      description="Transcode a video to a different format or codec using FFmpeg. Multiple CPU threads are used automatically."
      acceptedFormats="MP4, WebM, MKV, MOV, AVI, MPEG, OGG, 3GPP"
      acceptMime="video/*"
      onSubmit={async (file) => {
        const res = await convertVideo(file, {
          output_format: outputFormat,
          codec,
          crf,
          preset,
          notify_email: notifyEnabled && notifyEmail ? notifyEmail : undefined,
        });
        return res.data.job_id;
      }}
      fields={
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Video codec</Label>
            <Select value={codec} onValueChange={handleCodecChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="libx264">H.264 (libx264) → MP4</SelectItem>
                <SelectItem value="libx265">H.265 / HEVC (libx265) → MP4</SelectItem>
                <SelectItem value="libvpx-vp9">VP9 (libvpx-vp9) → WebM</SelectItem>
                <SelectItem value="libaom-av1">AV1 (libaom-av1) → MKV</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="crf">CRF (quality)</Label>
              <span className="text-sm font-mono text-muted-foreground">{crf}</span>
            </div>
            <Input
              id="crf"
              type="range"
              min={0}
              max={51}
              value={crf}
              onChange={(e) => setCrf(Number(e.target.value))}
              className="accent-primary h-2 cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              0 = lossless, 51 = worst quality. Default: 23
            </p>
          </div>

          <div className="space-y-1.5">
            <Label>Encoding preset</Label>
            <Select value={preset} onValueChange={setPreset}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['ultrafast', 'superfast', 'veryfast', 'faster', 'fast', 'medium', 'slow', 'slower', 'veryslow'].map(
                  (p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Slower presets = smaller files at higher CPU cost
            </p>
          </div>

          {emailConfigured && (
          <div className="space-y-2 rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="notify-enabled"
                checked={notifyEnabled}
                onCheckedChange={(v) => handleNotifyToggle(Boolean(v))}
              />
              <Label htmlFor="notify-enabled" className="cursor-pointer font-normal">
                Notify me by email when done
              </Label>
            </div>
            {notifyEnabled && (
              <Input
                type="email"
                placeholder="your@email.com"
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                autoComplete="email"
              />
            )}
          </div>
          )}
        </div>
      }
    />
  );
}
