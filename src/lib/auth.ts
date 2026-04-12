// Token storage keys
const ACCESS_KEY = 'mf_access_token';
const REFRESH_KEY = 'mf_refresh_token';
const USER_KEY = 'mf_user';

export function getAccessToken(): string | null {
  return typeof localStorage !== 'undefined' ? localStorage.getItem(ACCESS_KEY) : null;
}

export function getRefreshToken(): string | null {
  return typeof localStorage !== 'undefined' ? localStorage.getItem(REFRESH_KEY) : null;
}

export function getStoredUser(): { id: string; email: string } | null {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveTokens(access: string, refresh: string): void {
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

export function saveUser(user: { id: string; email: string }): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth(): void {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken());
}

export function requireAuth(): void {
  if (!isAuthenticated()) {
    window.location.href = '/login';
  }
}
