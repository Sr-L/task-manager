import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1';

/**
 * Creates an Axios instance pre-configured for the backend.
 * @param {() => string | null} getToken - function that returns the current JWT
 */
export function createHttpClient(getToken) {
  const client = axios.create({ baseURL: BASE_URL });

  client.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // Backend wraps every successful payload as { success, data }.
  // Unwrap so callers receive the inner payload directly.
  client.interceptors.response.use((response) => {
    const body = response.data;
    if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
      response.data = body.data;
    }
    return response;
  });

  return client;
}
