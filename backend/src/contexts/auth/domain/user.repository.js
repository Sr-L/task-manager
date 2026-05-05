export class UserRepository {
  async findByEmail(_email) {
    throw new Error('UserRepository.findByEmail not implemented');
  }

  async findCredentialsByEmail(_email) {
    throw new Error('UserRepository.findCredentialsByEmail not implemented');
  }

  async save(_data) {
    throw new Error('UserRepository.save not implemented');
  }
}
