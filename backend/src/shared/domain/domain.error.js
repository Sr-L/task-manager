export class DomainError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
  }
}

export class NotFoundError extends DomainError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

export class ForbiddenError extends DomainError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

export class ConflictError extends DomainError {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}

export class InvalidCredentialsError extends DomainError {
  constructor(message = 'Invalid credentials') {
    super(message, 401);
  }
}

export class WeakPasswordError extends DomainError {
  constructor(message = 'Password must be at least 6 characters') {
    super(message, 400);
  }
}
