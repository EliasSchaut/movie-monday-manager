import * as Joi from 'joi'
import { cron_pattern } from "./patterns/cron.pattern";
import { discord_webhook_pattern } from "./patterns/discord_webhook.pattern";

export const config_validation_schema = Joi.object({
  PROJECT_NAME: Joi.string().required()
    .description('The name of the project'),
  FRONTEND_URL: Joi.string().required().uri()
    .description('The URL of the client application (frontend). This is used for CORS and the email confirmation link'),
  PORT: Joi.number().required().default("3000").port()
    .description('The port the server should listen on'),

  DATABASE_URL: Joi.string().required().default("file:./dev.db")
    .description('The URL of the database'),
  JWT_SECRET: Joi.string().required().default("secret")
    .description('The secret used to sign the JWT tokens. The JWT tokens are used to authenticate the users'),
  JWT_EXPIRATION: Joi.string().required().default("2h")
    .description('The expiration time of the JWT tokens'),
  OMDB_API_KEY: Joi.string().required().token()
    .description('The API key for the OMDB API. Request a free key at https://www.omdbapi.com/apikey.aspx'),
  MAX_VOTES: Joi.number().required().default("20")
    .description('The maximum number of votes a user can cast in total for all movies'),
  MAX_PROPOSEABLE_MOVIES: Joi.number().required().default("5")
    .description('The maximum number of movies a user can propose'),

  SCHEDULE_WATCHLIST: Joi.string().required().default("0 15 * * 1").pattern(cron_pattern)
    .description('The cron pattern for the schedule that creates the watchlist for new movies and sends notifications per mail and Discord webhook'),
  SCHEDULE_START: Joi.string().required().default("0 19 * * 1").pattern(cron_pattern)
    .description('The cron pattern for the beginning of the movie event. This value is used to calculate the start times of the movies in the watchlist'),
  SCHEDULE_HISTORY: Joi.string().required().default("45 23 * * 1").pattern(cron_pattern)
    .description('The cron pattern for the schedule that creates the history for the movies in the watchlist and clears the watchlist'),
  PAUSE_TIME_MIN: Joi.number().required().default("15")
    .description('The minimum pause time between two movies in minutes'),
  NUM_OF_MOVIES: Joi.number().required().default("2")
    .description('The number of movies that will be in the watchlist at the same time'),

  EMAIL_HOST: Joi.string().required().domain()
    .description('The host of the SMTP server used to send emails'),
  EMAIL_PORT: Joi.number().required().default("587")
    .description('The port of the SMTP server used to send emails'),
  EMAIL_HOST_USER: Joi.string().required().email()
    .description('The username of the SMTP server used to send emails'),
  EMAIL_HOST_PASSWORD: Joi.string().required()
    .description('The password of the SMTP server used to send emails'),

  DISCORD_ENABLE: Joi.boolean().required().default("false")
    .description('Whether the Discord webhook should be used to send notifications'),
  DISCORD_WEBHOOK_URL: Joi.string().when('DISCORD_ENABLE', { is: true, then: Joi.required() }).pattern(discord_webhook_pattern)
    .description('The URL of the Discord webhook used to send notifications. This is optional if DISCORD_ENABLE is false'),
})
