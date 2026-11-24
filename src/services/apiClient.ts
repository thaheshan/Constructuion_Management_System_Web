/**
 * Core API Client for Construction Management System (CMS)
 * Provides centralized fetch configuration, credentials handling, timeout management,
 * and robust error normalization.
 */

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const DEFAULT_BASE_URL = 'http://localhost:8080/api/v1';

export function getBaseApiUrl(): string {
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
  }
  return DEFAULT_BASE_URL;
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  timeoutMs?: number;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, timeoutMs = 15000, headers: customHeaders, ...customConfig } = options;

  const baseUrl = getBaseApiUrl();
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = endpoint.startsWith('http://') || endpoint.startsWith('https://')
    ? endpoint
    : `${baseUrl}${normalizedEndpoint}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const headers = new Headers(customHeaders);
  if (!headers.has('Content-Type') && body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  // If a JWT token was saved in localStorage as optional backup, attach it
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined' && typeof window.localStorage.getItem === 'function') {
    const token = window.localStorage.getItem('cms_auth_token');
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  try {
    const response = await fetch(url, {
      ...customConfig,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      credentials: 'include', // Ensure httpOnly cookies are always attached
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Parse response body if present
    const contentType = response.headers.get('content-type');
    let responseData: any = null;
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      if (text) {
        try {
          responseData = JSON.parse(text);
        } catch {
          responseData = { message: text };
        }
      }
    }

    if (!response.ok) {
      let errorMessage = 'An unexpected error occurred. Please try again.';

      if (responseData) {
        if (typeof responseData.message === 'string' && responseData.message.trim()) {
          errorMessage = responseData.message;
        } else if (typeof responseData.error === 'string' && responseData.error.trim()) {
          errorMessage = responseData.error;
        } else if (Array.isArray(responseData.errors) && responseData.errors.length > 0) {
          errorMessage = responseData.errors.map((e: any) => e.message || String(e)).join(', ');
        }
      } else {
        if (response.status === 401) {
          errorMessage = 'Invalid credentials. Please verify and try again.';
        } else if (response.status === 403) {
          errorMessage = 'You do not have permission to perform this action.';
        } else if (response.status === 404) {
          errorMessage = 'The requested resource was not found.';
        } else if (response.status === 429) {
          errorMessage = 'Too many requests. Please wait a moment before trying again.';
        } else if (response.status >= 500) {
          errorMessage = 'Service temporarily unavailable. Please try again later.';
        }
      }

      throw new ApiError(errorMessage, response.status, responseData);
    }

    return responseData as T;
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof ApiError) {
      throw err;
    }

    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('Request timed out. Please check your internet connection.', 408);
    }

    const networkMessage =
      err instanceof Error && err.message
        ? err.message
        : 'Network connection error. Could not reach server.';

    throw new ApiError(networkMessage, 0);
  }
}
