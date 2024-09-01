import { PasswordService } from '@/common/services/password.service';

describe('PasswordService', () => {
  describe('hash_md5', () => {
    it('returns an MD5 hash for a valid input', async () => {
      const input = 'validInput';
      const hashed_input = await PasswordService.hash_md5(input);
      expect(hashed_input).toMatch(/^[a-f0-9]{32}$/);
    });

    it('returns different MD5 hashes for different inputs', async () => {
      const input1 = 'input1';
      const input2 = 'input2';
      const hashed_input1 = await PasswordService.hash_md5(input1);
      const hashed_input2 = await PasswordService.hash_md5(input2);
      expect(hashed_input1).not.toBe(hashed_input2);
    });

    it('returns the same MD5 hash for the same input', async () => {
      const input = 'sameInput';
      const hashed_input1 = await PasswordService.hash_md5(input);
      const hashed_input2 = await PasswordService.hash_md5(input);
      expect(hashed_input1).toBe(hashed_input2);
    });
  });

  describe('hash', () => {
    it('returns a hashed string for a valid password', async () => {
      const password = 'validPassword';
      const hashed_password = await PasswordService.hash(password);
      expect(hashed_password).toMatch(/^\$2[ayb]\$.{56}$/);
    });

    it('returns different hashes for the same password', async () => {
      const password = 'validPassword';
      const hashed_password_1 = await PasswordService.hash(password);
      const hashed_password_2 = await PasswordService.hash(password);
      expect(hashed_password_1).not.toBe(hashed_password_2);
    });
  });

  describe('compare', () => {
    it('returns true for matching password and hash', async () => {
      const password = 'validPassword';
      const hashed_password = await PasswordService.hash(password);
      const is_match = await PasswordService.compare(password, hashed_password);
      expect(is_match).toBe(true);
    });

    it('returns false for non-matching password and hash', async () => {
      const password = 'validPassword';
      const hashed_password = await PasswordService.hash(password);
      const is_match = await PasswordService.compare(
        'invalidPassword',
        hashed_password,
      );
      expect(is_match).toBe(false);
    });
  });

  describe('generate_challenge', () => {
    it('returns a string of correct length', () => {
      const result = PasswordService.generate_challenge();
      expect(result.length).toBe(20);
    });

    it('returns a string with strict character rules', () => {
      const result = PasswordService.generate_challenge();
      const strict_pattern = /^[A-Za-z0-9!@#$%^&*()_+[\]{};':"\\|,.<>/?`~\-]+$/;
      expect(strict_pattern.test(result)).toBe(true);
    });

    it('returns a different string each time it is called', () => {
      const result1 = PasswordService.generate_challenge();
      const result2 = PasswordService.generate_challenge();
      expect(result1).not.toBe(result2);
    });
  });
});
