import { UserModel } from './user.model.js';
import { UserEntity } from '../domain/user.entity.js';
import { UserRepository } from '../domain/user.repository.js';

function toEntity(doc) {
  return new UserEntity({
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    createdAt: doc.createdAt,
  });
}

export class MongoUserRepository extends UserRepository {
  async findByEmail(email) {
    const doc = await UserModel.findOne({ email });
    return doc ? toEntity(doc) : null;
  }

  async findCredentialsByEmail(email) {
    const doc = await UserModel.findOne({ email });
    if (!doc || !doc.password) return null;
    return { user: toEntity(doc), passwordHash: doc.password };
  }

  async save({ name, email, passwordHash }) {
    const doc = await UserModel.create({ name, email, password: passwordHash });
    return toEntity(doc);
  }
}
