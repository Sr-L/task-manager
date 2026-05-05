import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import bcrypt from 'bcryptjs';
import { LoginUserUseCase } from '../../../src/contexts/auth/application/login.user.use-case.js';

describe('LoginUserUseCase', () => {
  let userRepository;
  let jwtService;
  let useCase;
  const hashedPassword = bcrypt.hashSync('secret123', 10);

  beforeEach(() => {
    userRepository = { findByEmail: jest.fn() };
    jwtService = { signToken: jest.fn().mockReturnValue('jwt-token') };
    useCase = new LoginUserUseCase(userRepository, jwtService);
  });

  it('should return token and user on valid credentials', async () => {
    userRepository.findByEmail.mockResolvedValue({
      id: '123',
      email: 'luis@test.com',
      password: hashedPassword,
    });

    const result = await useCase.execute({ email: 'luis@test.com', password: 'secret123' });

    expect(result.token).toBe('jwt-token');
    expect(jwtService.signToken).toHaveBeenCalledWith({ id: '123', email: 'luis@test.com' });
  });

  it('should throw 401 when email is not found', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute({ email: 'noexiste@test.com', password: 'secret123' }))
      .rejects.toMatchObject({ message: 'Invalid credentials', status: 401 });
  });

  it('should throw 401 when password is incorrect', async () => {
    userRepository.findByEmail.mockResolvedValue({
      id: '123',
      email: 'luis@test.com',
      password: hashedPassword,
    });

    await expect(useCase.execute({ email: 'luis@test.com', password: 'wrongpassword' }))
      .rejects.toMatchObject({ message: 'Invalid credentials', status: 401 });
  });
});
