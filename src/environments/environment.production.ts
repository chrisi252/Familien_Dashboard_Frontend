declare global {
  interface Window {
    __env?: { API_URL?: string };
  }
}

function resolveApiBase(): string {
  if (typeof window !== 'undefined' && window.__env?.API_URL) {
    return window.__env.API_URL;
  }
  return '/api';
}

export const environment = {
  production: true,
  apiBase: resolveApiBase(),
};
