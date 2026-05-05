import { UserModel } from './user.model.js';
import { UserEntity } from '../domain/user.entity.js';

export class MongoUserRepository {
  async findByEmail(email) {
    const doc = await UserModel.findOne({ email });
    if (!doc) return null;
    return new UserEntity({ id: doc._id.toString(), name: doc.name, email: doc.email, password: doc.password, createdAt: doc.createdAt });
  }

  async save(user) {
    const doc = await UserModel.create({ name: user.name, email: user.email, password: user.password });
    return new UserEntity({ id: doc._id.toString(), name: doc.name, email: doc.email, password: doc.password, createdAt: doc.createdAt });
  }
}
