// Base API Client connecting to API Gateway (Port 8080)
// Supports JWT token forwarding, custom timeouts, and error handling.

const GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080';
const USE_MOCK_FALLBACK = import.meta.env.VITE_ENABLE_MOCK_FALLBACK !== 'false';

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

let isBackendReachable = true;
type HealthListener = (connected: boolean) => void;
const healthListeners = new Set<HealthListener>();

export function getIsBackendReachable(): boolean {
  return isBackendReachable;
}

export function setIsBackendReachable(reachable: boolean): void {
  if (isBackendReachable !== reachable) {
    isBackendReachable = reachable;
    healthListeners.forEach((listener) => {
      try {
        listener(reachable);
      } catch {
        // ignore listener errors
      }
    });
  }
}

export function subscribeToBackendHealth(listener: HealthListener): () => void {
  healthListeners.add(listener);
  return () => {
    healthListeners.delete(listener);
  };
}

export async function checkBackendHealth(): Promise<{
  connected: boolean;
  latencyMs: number;
  gatewayUrl: string;
  timestamp: Date;
  details?: string;
}> {
  const start = performance.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  try {
    const res = await fetch('/api/restaurants', {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const latency = Math.round(performance.now() - start);
    const connected = res.ok || res.status === 401 || res.status === 403;
    setIsBackendReachable(connected);
    return {
      connected,
      latencyMs: latency,
      gatewayUrl: GATEWAY_URL,
      timestamp: new Date(),
      details: connected ? `HTTP ${res.status} OK` : `HTTP ${res.status}`,
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const latency = Math.round(performance.now() - start);
    setIsBackendReachable(false);
    return {
      connected: false,
      latencyMs: latency,
      gatewayUrl: GATEWAY_URL,
      timestamp: new Date(),
      details: (err as Error)?.message || 'Connection refused',
    };
  }
}

export function getAuthToken(): string | null {
  return localStorage.getItem('quickbite_auth_token');
}

export function setAuthToken(token: string | null): void {
  if (token) {
    localStorage.setItem('quickbite_auth_token', token);
  } else {
    localStorage.removeItem('quickbite_auth_token');
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Use Vite proxy for relative /api paths, or absolute URL if specified
  const url = endpoint.startsWith('http') ? endpoint : `${endpoint}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    isBackendReachable = true;

    if (!response.ok) {
      let errorData: unknown;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }
      throw new ApiError(
        typeof errorData === 'object' && errorData && 'message' in errorData
          ? String((errorData as { message: string }).message)
          : `HTTP error ${response.status}`,
        response.status,
        errorData
      );
    }

    if (response.status === 204) {
      return {} as T;
    }

    return (await response.json()) as T;
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if ((err as Error)?.name === 'AbortError' || (err as Error)?.message?.includes('Failed to fetch')) {
      isBackendReachable = false;
    }
    throw err;
  }
}

export { USE_MOCK_FALLBACK, GATEWAY_URL };
