import { WebhookClient } from 'discord.js';
import { Injectable } from "@nestjs/common";

@Injectable()
export class DiscordService {
  private readonly webhookClient;

  constructor() {
    this.webhookClient = new WebhookClient({ url: process.env.DISCORD_WEBHOOK_URL as string });
  }

  async send_message(message: string) {
    return this.webhookClient.send(message);
  }
}