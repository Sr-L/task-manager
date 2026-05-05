import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { LoginUserUseCase } from '../../../src/contexts/auth/application/login.user.use-case.js';

describe('LoginUserUseCase', () => {
  let userRepository;
  let jwtService;
  let passwordHasher;
  let useCase;

  beforeEach(() => {
    userRepository = { findByEmail: jest.fn() };
    jwtService = { signToken: jest.fn().mockReturnValue('jwt-token') };
    passwordHasher = { hash: jest.fn(), compare: jest.fn() };
    useCase = new LoginUserUseCase(userRepository, jwtService, passwordHasher);
  });

  it('should return token and user on valid credentials', async () => {
    userRepository.findByEmail.mockResolvedValue({
      id: '123',
      email: 'luis@test.com',
      password: 'stored-hash',
    });
    passwordHasher.compare.mockResolvedValue(true);

    const result = await useCase.execute({ email: 'luis@test.com', password: 'secret123' });

    expect(passwordHasher.compare).toHaveBeenCalledWith('secret123', 'stored-hash');
    expect(result.token).toBe('jwt-token');
    expect(jwtService.signToken).toHaveBeenCalledWith({ id: '123', email: 'luis@test.com' });
  });

  it('should throw 401 when email is not found', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute({ email: 'noexiste@test.com', password: 'secret123' }))
      .rejects.toMatchObject({ message: 'Invalid credentials', status: 401 });

    expect(passwordHasher.compare).not.toHaveBeenCalled();
  });

  it('should throw 401 when password is incorrect', async () => {
    userRepository.findByEmail.mockResolvedValue({
      id: '123',
      email: 'luis@test.com',
      password: 'stored-hash',
    });
    passwordHasher.compare.mockResolvedValue(false);

    await expect(useCase.execute({ email: 'luis@test.com', password: 'wrongpassword' }))
      .rejects.toMatchObject({ message: 'Invalid credentials', status: 401 });

    expect(jwtService.signToken).not.toHaveBeenCalled();
  });
});
