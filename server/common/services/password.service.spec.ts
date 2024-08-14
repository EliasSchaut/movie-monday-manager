import { PasswordService } from '@/common/services/password.service';

describe('PasswordService', () => {
  let passwordService: PasswordService;

  beforeEach(() => {
    passwordService = new PasswordService();
  });

  describe('hash', () => {
    it('returns a hashed string for a valid password', async () => {
      const password = 'validPassword';
      const hashed_password = await passwordService.hash(password);
      expect(hashed_password).toMatch(/^\$2[ayb]\$.{56}$/);
    });

    it('returns different hashes for the same password', async () => {
      const password = 'validPassword';
      const hashed_password_1 = await passwordService.hash(password);
      const hashed_password_2 = await passwordService.hash(password);
      expect(hashed_password_1).not.toBe(hashed_password_2);
    });
  });

  describe('compare', () => {
    it('returns true for matching password and hash', async () => {
      const password = 'validPassword';
      const hashed_password = await passwordService.hash(password);
      const is_match = await passwordService.compare(password, hashed_password);
      expect(is_match).toBe(true);
    });

    it('returns false for non-matching password and hash', async () => {
      const password = 'validPassword';
      const hashed_password = await passwordService.hash(password);
      const is_match = await passwordService.compare(
        'invalidPassword',
        hashed_password,
      );
      expect(is_match).toBe(false);
    });
  });

  describe('generate_challenge', () => {
    it('returns a string of correct length', () => {
      const result = passwordService.generate_challenge();
      expect(result.length).toBe(20);
    });

    it('returns a string with strict character rules', () => {
      const result = passwordService.generate_challenge();
      const strict_pattern = /^[A-Za-z0-9!@#$%^&*()_+[\]{};':"\\|,.<>/?`~\-]+$/;
      expect(strict_pattern.test(result)).toBe(true);
    });

    it('returns a different string each time it is called', () => {
      const result1 = passwordService.generate_challenge();
      const result2 = passwordService.generate_challenge();
      expect(result1).not.toBe(result2);
    });
  });
});
