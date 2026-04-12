import { useState } from 'react';
import { BatchToolPage } from '../BatchToolPage';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { batchConvertToFormat } from '../../lib/api';

const FORMATS = ['png', 'jpg', 'gif', 'bmp', 'tiff', 'webp', 'avif'] as const;

export function ImageBatchFormatPage() {
  const [outputFormat, setOutputFormat] = useState<string>('png');

  return (
    <BatchToolPage
      title="Batch Convert to Format"
      description="Convert up to 20 images to any supported raster format in a single request. One background job is created per file."
      acceptedFormats="JPEG, PNG, GIF, WebP, TIFF, BMP, AVIF"
      acceptMime="image/*"
      maxFiles={20}
      onSubmit={async (files) => {
        const res = await batchConvertToFormat(files, outputFormat);
        return res.data.jobs;
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
