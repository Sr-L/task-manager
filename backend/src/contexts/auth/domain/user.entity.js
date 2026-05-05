export class UserEntity {
  constructor({ id, name, email, password, createdAt }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
  }

  toPublic() {
    return { id: this.id, name: this.name, email: this.email };
  }
}
