/**
 * Task repository contract.
 *
 * @typedef {Object} TaskRepository
 * @property {(task: TaskEntity) => Promise<TaskEntity>} save
 * @property {(userId: string) => Promise<TaskEntity[]>} findByUserId
 * @property {(id: string) => Promise<TaskEntity|null>} findById
 * @property {(id: string) => Promise<TaskEntity>} markCompleted
 * @property {(id: string) => Promise<void>} delete
 */

export const TaskRepository = {
  save: async (_task) => { throw new Error('Not implemented'); },
  findByUserId: async (_userId) => { throw new Error('Not implemented'); },
  findById: async (_id) => { throw new Error('Not implemented'); },
  markCompleted: async (_id) => { throw new Error('Not implemented'); },
  delete: async (_id) => { throw new Error('Not implemented'); },
};
