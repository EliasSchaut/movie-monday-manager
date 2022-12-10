import { WebhookClient } from 'discord.js';
import { Injectable } from "@nestjs/common";

@Injectable()
export class DiscordService {
  private readonly webhookClient;
  private readonly enabled = process.env.DISCORD_ENABLE === 'true';

  constructor() {
    if (this.enabled) {
      this.webhookClient = new WebhookClient({ url: process.env.DISCORD_WEBHOOK_URL as string });
    }
  }

  async send_message(message: string) {
    if (this.enabled) {
      // @ts-ignore
      return this.webhookClient.send(message);
    }
  }
}