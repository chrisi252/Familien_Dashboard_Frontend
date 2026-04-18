declare global {
  interface Window {
    __env?: { API_URL?: string };
  }
}

const API_BASE_FALLBACK = '/api';

function resolveApiBase(): string {
  if (typeof window !== 'undefined' && window.__env?.API_URL) {
    return window.__env.API_URL;
  }
  return API_BASE_FALLBACK;
}

export const environment = {
  production: false,
  apiBase: resolveApiBase(),
};
