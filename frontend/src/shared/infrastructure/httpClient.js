import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1';

/**
 * Creates an Axios instance pre-configured for the backend.
 * @param {() => void} [onUnauthorized] - invoked on any 401 response
 */
export function createHttpClient(onUnauthorized) {
  const client = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

  client.interceptors.response.use(
    (response) => {
      // Backend wraps every successful payload as { success, data }.
      // Unwrap so callers receive the inner payload directly.
      const body = response.data;
      if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
        response.data = body.data;
      }
      return response;
    },
    (error) => {
      if (error.response?.status === 401 && onUnauthorized) onUnauthorized();
      return Promise.reject(error);
    },
  );

  return client;
}
