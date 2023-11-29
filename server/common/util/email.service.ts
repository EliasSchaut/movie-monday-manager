import { Injectable } from '@nestjs/common';
const nodemailer = require('nodemailer');
import { TransportOptions } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;
  private readonly project_name = process.env.PROJECT_NAME;

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

  async send_verify(dest_mail: string, username: string, verify_url: string) {
    await this.transporter.sendMail({
      from: `"${this.project_name}" <noreply@schaut.dev>`,
      to: dest_mail,
      subject: `[${this.project_name}] Confirm your email!`,
      text:
        `Hello ${username},\n\nplease confirm your email by clicking the following link:\n${verify_url}\n\n` +
        `Dear\n${this.project_name} Team\n`,
    });
  }

  async send_password_reset(
    dest_mail: string,
    user_name: string,
    pw_reset_url: string,
  ) {
    await this.transporter.sendMail({
      from: `"${this.project_name}" <noreply@schaut.dev>`,
      to: dest_mail,
      subject: `[${this.project_name}] Password Reset Request!`,
      text:
        `Hello ${user_name},\n\nplease reset your password by clicking the following link:\n` +
        `${pw_reset_url}\n\nDear\n${this.project_name} Team\n`,
    });
  }

  generate_verify_url(challenge: string) {
    return `${process.env.FRONTEND_URL}login/${challenge}`;
  }

  generate_pw_reset_url(challenge: string) {
    return `${process.env.FRONTEND_URL}reset/${challenge}`;
  }
}
