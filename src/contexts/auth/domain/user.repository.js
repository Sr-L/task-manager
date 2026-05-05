/**
 * User repository contract.
 * Implementations must provide all methods below.
 *
 * @typedef {Object} UserRepository
 * @property {(email: string) => Promise<UserEntity|null>} findByEmail
 * @property {(user: UserEntity) => Promise<UserEntity>} save
 */

export const UserRepository = {
  findByEmail: async (_email) => { throw new Error('Not implemented'); },
  save: async (_user) => { throw new Error('Not implemented'); },
};
