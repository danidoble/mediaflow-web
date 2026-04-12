import { useState } from 'react';
import { ToolPage } from '../ToolPage';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { convertToFormat } from '../../lib/api';

const FORMATS = ['png', 'jpg', 'gif', 'bmp', 'tiff', 'webp', 'avif'] as const;

export function ImageFormatPage() {
  const [outputFormat, setOutputFormat] = useState<string>('png');

  return (
    <ToolPage
      title="Convert to Format"
      description="Convert an image to any supported raster format using FFmpeg. Choose the output format below."
      acceptedFormats="JPEG, PNG, GIF, WebP, TIFF, BMP, AVIF"
      acceptMime="image/*"
      onSubmit={async (file) => {
        const res = await convertToFormat(file, outputFormat);
        return res.data.job_id;
      }}
      fields={
        <div className="space-y-1.5">
          <Label htmlFor="output_format">Output format</Label>
          <Select value={outputFormat} onValueChange={setOutputFormat}>
            <SelectTrigger id="output_format">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              {FORMATS.map((f) => (
                <SelectItem key={f} value={f}>
                  {f.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Supported: PNG, JPG, GIF, BMP, TIFF, WebP, AVIF
          </p>
        </div>
      }
    />
  );
}
