/**
 * Backend Base URL. In dev, empty = use Vite proxy (no CORS). Set VITE_API_BASE_URL for prod.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? '' : 'http://localhost:8000');

/** API root for fetch calls: /api (proxied in dev) or ${API_BASE_URL}/api */
export const API_BASE = API_BASE_URL ? `${API_BASE_URL.replace(/\/$/, '')}/api` : '/api';
