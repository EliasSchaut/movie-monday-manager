import * as Joi from 'joi';

export const EnvValidationSchema = Joi.object({
  PROJECT_NAME: Joi.string().required().description('The name of the project'),
  FRONTEND_URL: Joi.string()
    .required()
    .uri()
    .description(
      'The URL of the client application (frontend). This is used for CORS and the email confirmation link',
    ),
  PORT: Joi.number()
    .required()
    .default('3000')
    .port()
    .description('The port the server should listen on'),

  DATABASE_URL: Joi.string()
    .required()
    .default('file:./dev.db')
    .description('The URL of the database'),
  JWT_SECRET: Joi.string()
    .required()
    .default('secret')
    .description(
      'The secret used to sign the JWT tokens. The JWT tokens are used to authenticate the users',
    ),
  JWT_EXPIRATION: Joi.string()
    .required()
    .default('2h')
    .description('The expiration time of the JWT tokens'),

  EMAIL_HOST: Joi.string()
    .required()
    .domain()
    .description('The host of the SMTP server used to send emails'),
  EMAIL_PORT: Joi.number()
    .required()
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
