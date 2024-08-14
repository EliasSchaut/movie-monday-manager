import { EmailService } from '@/common/services/email.service';
import nodemailer from 'nodemailer';
jest.mock('nodemailer');

describe('EmailService', () => {
  let emailService: EmailService;
  let sendMailMock: jest.Mock;

  beforeAll(() => {
    sendMailMock = jest.fn();
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });
    emailService = new EmailService();
  });

  describe('send_verify', () => {
    it('sends verification email with correct details', async () => {
      await emailService.send_verify(
        'test@example.com',
        'testuser',
        'http://example.com/verify',
        'TestServer',
      );
      expect(sendMailMock).toHaveBeenCalledWith({
        from: '"TestServer" <noreply@schaut.dev>',
        to: 'test@example.com',
        subject: '[TestServer] Confirm your email!',
        text: 'Hello testuser,\n\nplease confirm your email by clicking the following link:\nhttp://example.com/verify\n\nDear\nTestServer Team\n',
      });
    });
  });

  describe('send_password_reset', () => {
    it('sends password reset email with correct details', async () => {
      await emailService.send_password_reset(
        'test@example.com',
        'testuser',
        'http://example.com/reset',
        'TestServer',
      );
      expect(sendMailMock).toHaveBeenCalledWith({
        from: '"TestServer" <noreply@schaut.dev>',
        to: 'test@example.com',
        subject: '[TestServer] Password Reset Request!',
        text: 'Hello testuser,\n\nplease reset your password by clicking the following link:\nhttp://example.com/reset\n\nDear\nTestServer Team\n',
      });
    });
  });

  describe('generate_verify_url', () => {
    it('generates correct verification URL', () => {
      const url = emailService.generate_verify_url(
        'challenge123',
        'http://example.com',
      );
      expect(url).toBe('http://example.com/login/challenge123');
    });
  });

  describe('generate_pw_reset_url', () => {
    it('generates correct password reset URL', () => {
      const url = emailService.generate_pw_reset_url(
        'challenge123',
        'http://example.com',
      );
      expect(url).toBe('http://example.com/reset/challenge123');
    });
  });
});
