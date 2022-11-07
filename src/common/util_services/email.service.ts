import { Injectable } from "@nestjs/common";
const nodemailer = require("nodemailer");
import { TransportOptions } from "nodemailer";

@Injectable()
export class EmailService {

  private transporter
  private readonly project_name = process.env.PROJECT_NAME

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_HOST_USER,
        pass: process.env.EMAIL_HOST_PASSWORD,
      }
    } as TransportOptions)
  }

  async sendChallenge(dest_mail: string, user_name: string, challenge_url: string) {
    await this.transporter.sendMail({
      from: `"${this.project_name}" <noreply@schaut.dev>`,
      to: dest_mail,
      subject: `[${this.project_name}] Confirm your email!`,
      text: `Hello ${user_name},\n\nplease confirm your email by clicking the following link:\n${challenge_url}
      \n\nDear,\n${this.project_name} Team`,
    })
  }
}