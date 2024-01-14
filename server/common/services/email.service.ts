import { Injectable } from '@nestjs/common';
const nodemailer = require('nodemailer');
import { TransportOptions } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_HOST_USER,
        pass: process.env.EMAIL_HOST_PASSWORD,
      },
    } as TransportOptions);
  }

  async send_verify(dest_mail: string, username: string, verify_url: string, server_title: string) {
    await this.transporter.sendMail({
      from: `"${server_title}" <noreply@schaut.dev>`,
      to: dest_mail,
      subject: `[${server_title}] Confirm your email!`,
      text:
        `Hello ${username},\n\nplease confirm your email by clicking the following link:\n${verify_url}\n\n` +
        `Dear\n${server_title} Team\n`,
    });
  }

  async send_password_reset(
    dest_mail: string,
    username: string,
    pw_reset_url: string,
    server_title: string,
  ) {
    await this.transporter.sendMail({
      from: `"${server_title}" <noreply@schaut.dev>`,
      to: dest_mail,
      subject: `[${server_title}] Password Reset Request!`,
      text:
        `Hello ${username},\n\nplease reset your password by clicking the following link:\n` +
        `${pw_reset_url}\n\nDear\n${server_title} Team\n`,
    });
  }

  generate_verify_url(challenge: string, origin: string) {
    return `${origin}/login/${challenge}`;
  }

  generate_pw_reset_url(challenge: string, origin: string) {
    return `${origin}/reset/${challenge}`;
  }
}
