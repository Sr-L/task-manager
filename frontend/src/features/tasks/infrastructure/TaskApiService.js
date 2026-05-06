/**
 * @param {import('axios').AxiosInstance} http
 */
export function createTaskApiService(http) {
  async function getAll() {
    const { data } = await http.get('/tasks');
    return data;
  }

  async function create({ title, description, responsible }) {
    const { data } = await http.post('/tasks', { title, description, responsible });
    return data;
  }

  async function complete(id) {
    const { data } = await http.patch(`/tasks/${id}/complete`);
    return data;
  }

  async function remove(id) {
    await http.delete(`/tasks/${id}`);
  }

  return { getAll, create, complete, remove };
}
