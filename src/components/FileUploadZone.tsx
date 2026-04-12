import { useState, useRef } from 'react';
import { Upload, X, File as FileIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface FileUploadZoneProps {
  accept?: string;
  label?: string;
  hint?: string;
  onFile: (file: File | null) => void;
  file: File | null;
  disabled?: boolean;
}

export function FileUploadZone({
  accept,
  label = 'Drop file here or click to browse',
  hint,
  onFile,
  file,
  disabled = false,
}: FileUploadZoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const dropped = e.dataTransfer.files[0];
    if (dropped) onFile(dropped);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    onFile(selected);
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFile(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
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
        file && 'border-primary/40 bg-primary/5',
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={handleChange}
        disabled={disabled}
      />
      {file ? (
        <>
          <FileIcon className="h-8 w-8 text-primary" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium truncate max-w-[240px]">{file.name}</span>
            <button
              type="button"
              onClick={clear}
              className="rounded-full p-0.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <span className="text-xs text-muted-foreground">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </span>
        </>
      ) : (
        <>
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{label}</p>
          {hint && <p className="text-xs text-muted-foreground/70">{hint}</p>}
        </>
      )}
    </div>
  );
}
