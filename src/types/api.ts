// API response types

export interface ApiEnvelope<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

// Auth
export interface User {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
}

export interface RegisterResponse {
  user: User;
  tokens: TokenPair;
}

// Health
export type ServiceStatus = 'ok' | 'error' | string;

export interface HealthData {
  database: ServiceStatus;
  redis: ServiceStatus;
  minio: ServiceStatus;
  ffmpeg: ServiceStatus;
  cwebp: ServiceStatus;
  email: ServiceStatus;
}

// Jobs
export type JobStatus = 'pending' | 'started' | 'completed' | 'failed' | 'cancelled';

export type JobType =
  | 'image_convert_webp'
  | 'image_convert_avif'
  | 'image_convert_format'
  | 'image_resize'
  | 'video_convert'
  | 'video_rotate'
  | 'video_resize'
  | 'video_trim'
  | 'video_thumbnail';

export interface Job {
  id: string;
  status: JobStatus;
  job_type: JobType;
  result_url?: string | null;
  result_expired?: boolean | null;
  progress?: number | null;
  error?: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobsPage {
  items: Job[];
  total: number;
  page: number;
  page_size: number;
}

export interface JobQueued {
  job_id: string;
  status: 'pending';
}

export interface BatchJobItem {
  job_id: string;
  filename: string;
  status: 'pending';
}

export interface BatchJobsQueued {
  jobs: BatchJobItem[];
  total: number;
}

// Query params for listing jobs
export interface ListJobsParams {
  page?: number;
  page_size?: number;
  status?: JobStatus;
  job_type?: JobType;
}
