import { describe, it, expect } from '@jest/globals';
import { BcryptPasswordHasher } from '../../../src/contexts/auth/infrastructure/bcrypt.password.hasher.js';

describe('BcryptPasswordHasher', () => {
  // Lower rounds for speed; cost is verified separately below.
  const hasher = new BcryptPasswordHasher(4);

  it('hashes a plain password to a bcrypt-formatted string', async () => {
    const hash = await hasher.hash('secret123');

    expect(hash).toMatch(/^\$2[aby]\$/);
    expect(hash).not.toBe('secret123');
  });

  it('produces different hashes for the same plain text (salted)', async () => {
    const a = await hasher.hash('secret123');
    const b = await hasher.hash('secret123');

    expect(a).not.toBe(b);
  });

  it('compare returns true for the correct plain text', async () => {
    const hash = await hasher.hash('secret123');

    await expect(hasher.compare('secret123', hash)).resolves.toBe(true);
  });

  it('compare returns false for an incorrect plain text', async () => {
    const hash = await hasher.hash('secret123');

    await expect(hasher.compare('wrongpassword', hash)).resolves.toBe(false);
  });

  it('uses the configured cost factor in the produced hash', async () => {
    const fast = new BcryptPasswordHasher(4);
    const hash = await fast.hash('secret123');

    // bcrypt format: $2a$NN$...  where NN is the cost.
    expect(hash).toMatch(/^\$2[aby]\$04\$/);
  });

  it('defaults to 10 rounds when no cost is provided', async () => {
    const def = new BcryptPasswordHasher();
    const hash = await def.hash('secret123');

    expect(hash).toMatch(/^\$2[aby]\$10\$/);
  });
});
