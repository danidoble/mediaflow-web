import { useState, useRef } from 'react';
import { Upload, X, File as FileIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface MultiFileUploadZoneProps {
  accept?: string;
  label?: string;
  hint?: string;
  maxFiles?: number;
  onFiles: (files: File[]) => void;
  files: File[];
  disabled?: boolean;
}

export function MultiFileUploadZone({
  accept,
  label = 'Drop files here or click to browse',
  hint,
  maxFiles = 20,
  onFiles,
  files,
  disabled = false,
}: MultiFileUploadZoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const merge = (incoming: FileList | null) => {
    if (!incoming) return;
    const next = [...files];
    for (const f of Array.from(incoming)) {
      if (next.length >= maxFiles) break;
      if (!next.some((x) => x.name === f.name && x.size === f.size)) next.push(f);
    }
    onFiles(next);
  };

  const remove = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = files.filter((_, i) => i !== idx);
    onFiles(next);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    merge(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    merge(e.target.files);
  };

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && !disabled && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 text-center cursor-pointer',
          'transition-colors duration-150',
          dragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-muted/40',
          disabled && 'pointer-events-none opacity-50',
          files.length > 0 && 'border-primary/40 bg-primary/5',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          className="sr-only"
          onChange={handleChange}
          disabled={disabled}
        />
        <Upload className="h-8 w-8 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">{label}</p>
          {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
          <p className="text-xs text-muted-foreground mt-1">
            {files.length}/{maxFiles} files selected
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <ul className="space-y-1.5 max-h-48 overflow-auto">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2 text-sm"
            >
              <div className="flex items-center gap-2 min-w-0">
                <FileIcon className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate">{f.name}</span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {(f.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => remove(i, e)}
                className="ml-2 shrink-0 rounded-full p-0.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
