import * as Joi from 'joi';

export const EnvValidationSchema = Joi.object({
  PORT: Joi.number()
    .default('3000')
    .port()
    .description('The port the server should listen on'),

  PORT_NEST_DEVTOOLS: Joi.number()
    .default('3001')
    .port()
    .description('The port for the NestJs Devtools'),

  IMDB_API_KEY: Joi.string()
    .required()
    .pattern(/^k_.+$/)
    .description(
      'An API key of website https://imdb-api.com/ to retrieve movie data',
    ),
  DATABASE_URL: Joi.string()
    .default('file:./dev.db')
    .description('The URL of the database'),

  JWT_SECRET: Joi.string()
    .required()
    .disallow('secret')
    .description(
      'The secret used to sign the JWT tokens. The JWT tokens are used to authenticate the users. Should be a very long and random string',
    ),

  JWT_EXPIRATION: Joi.string()
    .default('2h')
    .description('The expiration time of the JWT tokens'),

  EMAIL_HOST: Joi.string()
    .required()
    .domain()
    .description('The host of the SMTP server used to send emails'),

  EMAIL_PORT: Joi.number()
    .default('587')

    .description('The port of the SMTP server used to send emails'),
  EMAIL_HOST_USER: Joi.string()
    .required()
    .email()
    .description('The username of the SMTP server used to send emails'),

  EMAIL_HOST_PASSWORD: Joi.string()
    .required()
    .description('The password of the SMTP server used to send emails'),
});
