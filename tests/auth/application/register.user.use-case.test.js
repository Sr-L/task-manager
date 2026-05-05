import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { RegisterUserUseCase } from '../../../src/contexts/auth/application/register.user.use-case.js';

describe('RegisterUserUseCase', () => {
  let userRepository;
  let useCase;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
    };
    useCase = new RegisterUserUseCase(userRepository);
  });

  it('should register a user with valid data', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.save.mockResolvedValue({
      id: '123',
      name: 'Luis',
      email: 'luis@test.com',
      toPublic: () => ({ id: '123', name: 'Luis', email: 'luis@test.com' }),
    });

    const result = await useCase.execute({ name: 'Luis', email: 'luis@test.com', password: 'secret123' });

    expect(userRepository.findByEmail).toHaveBeenCalledWith('luis@test.com');
    expect(userRepository.save).toHaveBeenCalledTimes(1);
    expect(result.email).toBe('luis@test.com');
  });

  it('should throw 409 when email is already in use', async () => {
    userRepository.findByEmail.mockResolvedValue({ id: '999', email: 'luis@test.com' });

    await expect(useCase.execute({ name: 'Luis', email: 'luis@test.com', password: 'secret123' }))
      .rejects.toMatchObject({ message: 'Email already in use', status: 409 });

    expect(userRepository.save).not.toHaveBeenCalled();
  });

  it('should hash the password before saving', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.save.mockImplementation((user) => Promise.resolve(user));

    await useCase.execute({ name: 'Luis', email: 'luis@test.com', password: 'secret123' });

    const savedUser = userRepository.save.mock.calls[0][0];
    expect(savedUser.password).not.toBe('secret123');
    expect(savedUser.password).toMatch(/^\$2[aby]\$/);
  });
});
