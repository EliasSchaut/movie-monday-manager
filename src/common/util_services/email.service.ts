import { Injectable } from "@nestjs/common";

const nodemailer = require("nodemailer");
import { TransportOptions } from "nodemailer";
import { UserDBService } from "../db_services/users/userDB.service";

@Injectable()
export class EmailService {

  private transporter;
  private readonly project_name = process.env.PROJECT_NAME;

  constructor(private readonly userDBService: UserDBService) {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_HOST_USER,
        pass: process.env.EMAIL_HOST_PASSWORD
      }
    } as TransportOptions);
  }

  async send_challenge(dest_mail: string, user_name: string, challenge_url: string) {
    await this.transporter.sendMail({
      from: `"${this.project_name}" <noreply@schaut.dev>`,
      to: dest_mail,
      subject: `[${this.project_name}] Confirm your email!`,
      html: `<p>Hello ${user_name},</p>
        <p>
          please confirm your email by clicking the following link:<br>
          <a href="${challenge_url}" target="_blank">${challenge_url}</a>
        </p>
        <p>Dear,<br>${this.project_name} Team</p>`
    });
  }

  async send_password_reset(dest_mail: string, user_name: string, challenge_url: string) {
    await this.transporter.sendMail({
      from: `"${this.project_name}" <noreply@schaut.dev>`,
      to: dest_mail,
      subject: `[${this.project_name}] Password Reset Request!`,
      html: `<p>Hello ${user_name},</p>
        <p>
          please reset your password by clicking the following link:<br>
          <a href="${challenge_url}" target="_blank">${challenge_url}</a>
        </p>
        <p>Dear,<br>${this.project_name} Team</p>`
    });
  }

  async send_all_opt_in(body_html: string) {
    const opt_in_users = await this.userDBService.get_all_opt_in();
    for (const user of opt_in_users) {
      await this.transporter.sendMail({
        from: `"${this.project_name}" <noreply@schaut.dev>`,
        to: user.username,
        subject: `[${this.project_name}] Announcement!`,
        html: `<p>Hello ${user.name},</p>
        <p>
          ${body_html}
        </p>
        <p>Dear,<br>${this.project_name} Team</p>`
      });
    }
  }

  generate_challenge_url(challenge: string) {
    return `${process.env.FRONTEND_URL}login/${challenge}`;
  }

  generate_pw_challenge_url(challenge: string) {
    return `${process.env.FRONTEND_URL}reset/${challenge}`;
  }
}