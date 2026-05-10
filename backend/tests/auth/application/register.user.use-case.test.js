import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { RegisterUserUseCase } from '../../../src/contexts/auth/application/register.user.use-case.js';

describe('RegisterUserUseCase', () => {
  let userRepository;
  let jwtService;
  let passwordHasher;
  let useCase;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
    };
    jwtService = {
      signToken: jest.fn().mockReturnValue('jwt-token'),
      verifyToken: jest.fn(),
    };
    passwordHasher = {
      hash: jest.fn().mockResolvedValue('hashed-password'),
      compare: jest.fn(),
    };
    useCase = new RegisterUserUseCase(userRepository, jwtService, passwordHasher);
  });

  it('should register a user with valid data and return { token, user }', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.save.mockResolvedValue({ id: '123', name: 'Luis', email: 'luis@test.com' });

    const result = await useCase.execute({ name: 'Luis', email: 'luis@test.com', password: 'secret123' });

    expect(userRepository.findByEmail).toHaveBeenCalledWith('luis@test.com');
    expect(userRepository.save).toHaveBeenCalledTimes(1);
    expect(jwtService.signToken).toHaveBeenCalledWith({ id: '123', email: 'luis@test.com' });
    expect(result).toEqual({
      token: 'jwt-token',
      user: { id: '123', name: 'Luis', email: 'luis@test.com' },
    });
  });

  it('should throw 409 when email is already in use', async () => {
    userRepository.findByEmail.mockResolvedValue({ id: '999', email: 'luis@test.com' });

    await expect(useCase.execute({ name: 'Luis', email: 'luis@test.com', password: 'secret123' }))
      .rejects.toMatchObject({ message: 'Email already in use', status: 409 });

    expect(userRepository.save).not.toHaveBeenCalled();
  });

  it('should pass the hashed password to save (never the plain text)', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.save.mockImplementation((arg) => Promise.resolve({ id: '1', ...arg }));

    await useCase.execute({ name: 'Luis', email: 'luis@test.com', password: 'secret123' });

    expect(passwordHasher.hash).toHaveBeenCalledWith('secret123');
    const arg = userRepository.save.mock.calls[0][0];
    expect(arg).toEqual({ name: 'Luis', email: 'luis@test.com', passwordHash: 'hashed-password' });
    expect(arg.password).toBeUndefined();
  });

  it('should reject passwords shorter than 6 characters', async () => {
    await expect(useCase.execute({ name: 'Luis', email: 'luis@test.com', password: '123' }))
      .rejects.toMatchObject({ status: 400, name: 'WeakPasswordError' });

    expect(userRepository.findByEmail).not.toHaveBeenCalled();
    expect(userRepository.save).not.toHaveBeenCalled();
  });

  it('should reject empty password', async () => {
    await expect(useCase.execute({ name: 'Luis', email: 'luis@test.com', password: '' }))
      .rejects.toMatchObject({ status: 400, name: 'WeakPasswordError' });
  });
});
