/**
 * @param {import('axios').AxiosInstance} http
 */
export function createAuthApiService(http) {
  http.defaults.withCredentials = true;

  async function login({ email, password }) {
    const { data } = await http.post('/auth/login', { email, password });
    return data; 
  }

  async function register({ name, email, password }) {
    const { data } = await http.post('/auth/register', { name, email, password });
    return data; 
  }

  async function logout() {
    await http.post('/auth/logout');
  }

  return { login, register, logout };
}
