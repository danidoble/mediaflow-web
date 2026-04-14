import type {
  ApiEnvelope,
  RegisterResponse,
  TokenPair,
  User,
  HealthData,
  Job,
  JobQueued,
  BatchJobsQueued,
  JobsPage,
  ListJobsParams,
} from '../types/api';
import { getAccessToken, getRefreshToken, saveTokens, clearAuth } from './auth';

const BASE = import.meta.env.PUBLIC_API_BASE_URL || '';
const API = `${BASE}/api/v1`;

// ── Core fetch wrapper ────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  init: RequestInit = {},
  retry = true,
): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, { ...init, headers });

  // Attempt token refresh on 401
  if (res.status === 401 && retry) {
    const refreshed = await tryRefresh();
    if (refreshed) return request<T>(path, init, false);
    clearAuth();
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  if (res.status === 204) return undefined as T;

  const body = await res.json();
  if (!res.ok) {
    const msg =
      body?.detail ??
      body?.message ??
      `Request failed with status ${res.status}`;
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
  }
  return body as T;
}

async function tryRefresh(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${API}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) return false;
    const body: ApiEnvelope<{ access_token: string; refresh_token: string }> =
      await res.json();
    saveTokens(body.data.access_token, body.data.refresh_token);
    return true;
  } catch {
    return false;
  }
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function register(
  email: string,
  password: string,
): Promise<ApiEnvelope<RegisterResponse>> {
  return fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }).then(async (res) => {
    const body = await res.json();
    if (!res.ok) throw new Error(body?.detail ?? body?.message ?? 'Registration failed');
    return body;
  });
}

export async function login(email: string, password: string): Promise<TokenPair> {
  const form = new URLSearchParams({ username: email, password });
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    body: form,
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body?.detail ?? body?.message ?? 'Login failed');
  return body as TokenPair;
}

export async function getMe(): Promise<ApiEnvelope<User>> {
  return request<ApiEnvelope<User>>('/auth/me');
}

// ── Health ────────────────────────────────────────────────────────────────────

export async function getHealth(): Promise<ApiEnvelope<HealthData>> {
  const res = await fetch(`${API}/health`);
  return res.json();
}

// ── Image endpoints ───────────────────────────────────────────────────────────

export async function convertToWebp(
  file: File,
  quality: number,
  lossless: boolean,
  notify_email?: string,
): Promise<ApiEnvelope<JobQueued>> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('quality', String(quality));
  fd.append('lossless', String(lossless));
  if (notify_email) fd.append('notify_email', notify_email);
  return request<ApiEnvelope<JobQueued>>('/image/convert/webp', { method: 'POST', body: fd });
}

export async function convertToAvif(
  file: File,
  quality: number,
  notify_email?: string,
): Promise<ApiEnvelope<JobQueued>> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('quality', String(quality));
  if (notify_email) fd.append('notify_email', notify_email);
  return request<ApiEnvelope<JobQueued>>('/image/convert/avif', { method: 'POST', body: fd });
}

export async function resizeImage(
  file: File,
  params: { width?: number; height?: number; fit: string; notify_email?: string },
): Promise<ApiEnvelope<JobQueued>> {
  const fd = new FormData();
  fd.append('file', file);
  if (params.width) fd.append('width', String(params.width));
  if (params.height) fd.append('height', String(params.height));
  fd.append('fit', params.fit);
  if (params.notify_email) fd.append('notify_email', params.notify_email);
  return request<ApiEnvelope<JobQueued>>('/image/resize', { method: 'POST', body: fd });
}

export async function convertToFormat(
  file: File,
  output_format: string,
  notify_email?: string,
): Promise<ApiEnvelope<JobQueued>> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('output_format', output_format);
  if (notify_email) fd.append('notify_email', notify_email);
  return request<ApiEnvelope<JobQueued>>('/image/convert/format', { method: 'POST', body: fd });
}

export async function batchConvertToWebp(
  files: File[],
  quality: number,
  lossless: boolean,
  notify_email?: string,
): Promise<ApiEnvelope<BatchJobsQueued>> {
  const fd = new FormData();
  files.forEach((f) => fd.append('files', f));
  fd.append('quality', String(quality));
  fd.append('lossless', String(lossless));
  if (notify_email) fd.append('notify_email', notify_email);
  return request<ApiEnvelope<BatchJobsQueued>>('/image/batch/convert/webp', { method: 'POST', body: fd });
}

export async function batchConvertToAvif(
  files: File[],
  quality: number,
  notify_email?: string,
): Promise<ApiEnvelope<BatchJobsQueued>> {
  const fd = new FormData();
  files.forEach((f) => fd.append('files', f));
  fd.append('quality', String(quality));
  if (notify_email) fd.append('notify_email', notify_email);
  return request<ApiEnvelope<BatchJobsQueued>>('/image/batch/convert/avif', { method: 'POST', body: fd });
}

export async function batchConvertToFormat(
  files: File[],
  output_format: string,
  notify_email?: string,
): Promise<ApiEnvelope<BatchJobsQueued>> {
  const fd = new FormData();
  files.forEach((f) => fd.append('files', f));
  fd.append('output_format', output_format);
  if (notify_email) fd.append('notify_email', notify_email);
  return request<ApiEnvelope<BatchJobsQueued>>('/image/batch/convert/format', { method: 'POST', body: fd });
}

// ── Video endpoints ───────────────────────────────────────────────────────────

export async function convertVideo(
  file: File,
  params: { output_format: string; codec: string; crf: number; preset: string; notify_email?: string },
): Promise<ApiEnvelope<JobQueued>> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('output_format', params.output_format);
  fd.append('codec', params.codec);
  fd.append('crf', String(params.crf));
  fd.append('preset', params.preset);
  if (params.notify_email) fd.append('notify_email', params.notify_email);
  return request<ApiEnvelope<JobQueued>>('/video/convert', { method: 'POST', body: fd });
}

export async function rotateVideo(
  file: File,
  degrees: number,
  no_transcode: boolean,
  notify_email?: string,
): Promise<ApiEnvelope<JobQueued>> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('degrees', String(degrees));
  fd.append('no_transcode', String(no_transcode));
  if (notify_email) fd.append('notify_email', notify_email);
  return request<ApiEnvelope<JobQueued>>('/video/rotate', { method: 'POST', body: fd });
}

export async function resizeVideo(
  file: File,
  params: { width?: number; height?: number; keep_aspect: boolean; notify_email?: string },
): Promise<ApiEnvelope<JobQueued>> {
  const fd = new FormData();
  fd.append('file', file);
  if (params.width) fd.append('width', String(params.width));
  if (params.height) fd.append('height', String(params.height));
  fd.append('keep_aspect', String(params.keep_aspect));
  if (params.notify_email) fd.append('notify_email', params.notify_email);
  return request<ApiEnvelope<JobQueued>>('/video/resize', { method: 'POST', body: fd });
}

export async function trimVideo(
  file: File,
  start_time: string,
  end_time: string,
  notify_email?: string,
): Promise<ApiEnvelope<JobQueued>> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('start_time', start_time);
  fd.append('end_time', end_time);
  if (notify_email) fd.append('notify_email', notify_email);
  return request<ApiEnvelope<JobQueued>>('/video/trim', { method: 'POST', body: fd });
}

export async function extractThumbnail(
  file: File,
  timestamp: string,
  notify_email?: string,
): Promise<ApiEnvelope<JobQueued>> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('timestamp', timestamp);
  if (notify_email) fd.append('notify_email', notify_email);
  return request<ApiEnvelope<JobQueued>>('/video/thumbnail', { method: 'POST', body: fd });
}

// ── Jobs ──────────────────────────────────────────────────────────────────────

export async function listJobs(
  params: ListJobsParams = {},
): Promise<ApiEnvelope<JobsPage>> {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.page_size) qs.set('page_size', String(params.page_size));
  if (params.status) qs.set('status', params.status);
  if (params.job_type) qs.set('job_type', params.job_type);
  return request<ApiEnvelope<JobsPage>>(`/jobs?${qs}`);
}

export async function getJob(id: string): Promise<ApiEnvelope<Job>> {
  return request<ApiEnvelope<Job>>(`/jobs/${id}`);
}

export async function cancelJob(id: string): Promise<void> {
  return request<void>(`/jobs/${id}`, { method: 'DELETE' });
}
