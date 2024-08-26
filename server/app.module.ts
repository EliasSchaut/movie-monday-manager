import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { I18nJsonLoader, I18nModule } from 'nestjs-i18n';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

import { EnvValidationSchema } from '@/common/validation/env.validation';
import { I18nLangResolver } from '@/common/middleware/i18n.resolver';
import { AuthModule } from '@/graphql/auth/auth.module';
import { ServerModule } from '@/graphql/server/server.module';
import { UserModule } from '@/graphql/user/user.module';
import { MovieModule } from '@/graphql/movie/movie.module';
import { HistoryModule } from '@/graphql/history/history.module';
import { VoteModule } from '@/graphql/vote/vote.module';
import { WatchlistModule } from '@/graphql/watchlist/watchlist.module';
import { loggingMiddleware, PrismaModule } from 'nestjs-prisma';
import { JwtModule } from '@nestjs/jwt';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import * as process from 'node:process';

@Module({
  imports: [
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
      port: Number(process.env.PORT_NEST_DEVTOOLS),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: EnvValidationSchema,
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          loggingMiddleware({
            logger: new Logger('PrismaMiddleware'),
            logLevel: 'debug',
          }),
        ],
      },
    }),
    I18nModule.forRoot({
      fallbackLanguage: process.env.DEFAULT_LANGUAGE as string,
      loaderOptions: {
        path: join(__dirname, '/locales/'),
        watch: process.env.NODE_ENV !== 'production',
      },
      loader: I18nJsonLoader,
      resolvers: [I18nLangResolver],
      typesOutputPath: join(
        __dirname,
        'types',
        'generated',
        'i18n.generated.ts',
      ),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      subscriptions: {
        'graphql-ws': true,
      },
      autoSchemaFile: join(__dirname, 'types', 'generated', 'schema.gql'),
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET as string,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION as string },
    }),
    AuthModule,
    ServerModule,
    UserModule,
    MovieModule,
    VoteModule,
    HistoryModule,
    WatchlistModule,
  ],
})
export class AppModule {}
