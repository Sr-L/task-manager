import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { LoginUserUseCase } from '../../../src/contexts/auth/application/login.user.use-case.js';

describe('LoginUserUseCase', () => {
  let userRepository;
  let jwtService;
  let passwordHasher;
  let useCase;

  beforeEach(() => {
    userRepository = { findCredentialsByEmail: jest.fn() };
    jwtService = { signToken: jest.fn().mockReturnValue('jwt-token') };
    passwordHasher = { hash: jest.fn(), compare: jest.fn() };
    useCase = new LoginUserUseCase(userRepository, jwtService, passwordHasher);
  });

  it('should return token and user (without hash) on valid credentials', async () => {
    userRepository.findCredentialsByEmail.mockResolvedValue({
      user: { id: '123', name: 'Luis', email: 'luis@test.com' },
      passwordHash: 'stored-hash',
    });
    passwordHasher.compare.mockResolvedValue(true);

    const result = await useCase.execute({ email: 'luis@test.com', password: 'secret123' });

    expect(passwordHasher.compare).toHaveBeenCalledWith('secret123', 'stored-hash');
    expect(result.token).toBe('jwt-token');
    expect(result.user).toEqual({ id: '123', name: 'Luis', email: 'luis@test.com' });
    expect(result.user.password).toBeUndefined();
    expect(jwtService.signToken).toHaveBeenCalledWith({ id: '123', email: 'luis@test.com' });
  });

  it('should throw 401 when email is not found', async () => {
    userRepository.findCredentialsByEmail.mockResolvedValue(null);

    await expect(useCase.execute({ email: 'noexiste@test.com', password: 'secret123' }))
      .rejects.toMatchObject({ message: 'Invalid credentials', status: 401 });

    expect(passwordHasher.compare).not.toHaveBeenCalled();
  });

  it('should throw 401 when password is incorrect', async () => {
    userRepository.findCredentialsByEmail.mockResolvedValue({
      user: { id: '123', name: 'Luis', email: 'luis@test.com' },
      passwordHash: 'stored-hash',
    });
    passwordHasher.compare.mockResolvedValue(false);

    await expect(useCase.execute({ email: 'luis@test.com', password: 'wrongpassword' }))
      .rejects.toMatchObject({ message: 'Invalid credentials', status: 401 });

    expect(jwtService.signToken).not.toHaveBeenCalled();
  });
});
