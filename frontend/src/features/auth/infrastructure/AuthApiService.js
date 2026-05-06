/**
 * @param {import('axios').AxiosInstance} http
 */
export function createAuthApiService(http) {
  async function login({ email, password }) {
    const { data } = await http.post('/auth/login', { email, password });
    return data; // { token, user }
  }

  async function register({ name, email, password }) {
    const { data } = await http.post('/auth/register', { name, email, password });
    return data; // { token, user }
  }

  return { login, register };
}
