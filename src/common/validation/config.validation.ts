import * as Joi from 'joi'

const cron_pattern = /(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})/
const discord_webhook_pattern = /^https:\/\/discord.com\/api\/webhooks\/[0-9]+\/.+$/

export const config_validation_schema = Joi.object({
  PROJECT_NAME: Joi.string().required(),
  FRONTEND_URL: Joi.string().required().uri(),
  PORT: Joi.number().required().default("3000").port(),

  DATABASE_URL: Joi.string().required().default("file:./dev.db"),
  JWT_SECRET: Joi.string().required().default("secret"),
  JWT_EXPIRATION: Joi.string().required().default("2h"),
  OMDB_API_KEY: Joi.string().required().token(),
  MAX_VOTES: Joi.number().required().default("5"),

  SCHEDULE_WATCHLIST: Joi.string().required().default("0 15 * * 1").pattern(cron_pattern),
  SCHEDULE_START: Joi.string().required().default("0 19 * * 1").pattern(cron_pattern),
  SCHEDULE_HISTORY: Joi.string().required().default("45 23 * * 1").pattern(cron_pattern),
  PAUSE_TIME_MIN: Joi.number().required().default("15"),
  NUM_OF_MOVIES: Joi.number().required().default("2"),

  EMAIL_HOST: Joi.string().required().domain(),
  EMAIL_PORT: Joi.number().required().default("587"),
  EMAIL_HOST_USER: Joi.string().required().email(),
  EMAIL_HOST_PASSWORD: Joi.string().required(),

  DISCORD_ENABLE: Joi.boolean().required().default("false"),
  DISCORD_WEBHOOK_URL: Joi.string().when('DISCORD_ENABLE', { is: true, then: Joi.required() }).pattern(discord_webhook_pattern),
})
