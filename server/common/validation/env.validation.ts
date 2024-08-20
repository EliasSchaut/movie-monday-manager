import * as Joi from 'joi';

export const EnvValidationSchema = Joi.object({
  PORT_FRONTEND: Joi.number()
    .default('3000')
    .port()
    .description('The port the frontend server should listen on'),

  PORT_BACKEND: Joi.number()
    .default('3001')
    .port()
    .description('The port the backend server should listen on'),

  PORT_NEST_DEVTOOLS: Joi.number()
    .default('8000')
    .port()
    .description('The port for the NestJs Devtools'),

  FRONTEND_URL: Joi.string()
    .default('http://localhost:3000')
    .uri()
    .description('The URL of the frontend server'),

  BACKEND_URL: Joi.string()
    .default('http://localhost:3001')
    .uri()
    .description('The URL of the backend server'),

  DATABASE_URL: Joi.string()
    .default('file:./dev.db')
    .description(
      'The URL of the database. Supports SQLite, MySQL, MariaDB, Postgres, and MSSQL',
    ),

  JWT_SECRET: Joi.string()
    .required()
    .disallow('secret')
    .description(
      'The secret used to sign the JWT tokens. The JWT tokens are used to authenticate the users. Should be a very long and random string.',
    ),

  JWT_EXPIRATION: Joi.string()
    .default('2h')
    .description('The expiration time of the JWT tokens'),

  TMDB_API_KEY: Joi.string()
    .optional()
    .description('The API key for The Movie Database (TMDb)'),

  OMDB_API_KEY: Joi.string()
    .optional()
    .description('The API key for the Open Movie Database (OMDb)'),

  EMAIL_HOST: Joi.string()
    .optional()
    .domain()
    .description('The host of the SMTP server used to send emails'),

  EMAIL_PORT: Joi.number()
    .optional()
    .default('587')
    .port()
    .description('The port of the SMTP server used to send emails'),

  EMAIL_HOST_USER: Joi.string()
    .optional()
    .description('The username of the SMTP server used to send emails'),

  EMAIL_HOST_PASSWORD: Joi.string()
    .optional()
    .description('The password of the SMTP server used to send emails'),
});
