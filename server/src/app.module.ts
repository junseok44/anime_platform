import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { join } from 'path';
import { AnimeEpisodeModule } from './anime-episode/anime-episode.module';
import { AnimeModule } from './anime/anime.module';
import { AnimeService } from './anime/anime.service';
import { AuthModule } from './auth/auth.module';
import { JwtMiddleware } from './auth/middleware/jwt.middleware';
import { CommentModule } from './comments/comment.module';
import { getTypeOrmConfig } from './common/config/typeorm.config';
import { createEpisodeLoader } from './common/graphql/loader/anime-episode.loader';
import { UsersModule } from './users/users.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { APP_GUARD } from '@nestjs/core';
import { RateLimitGuard } from './common/guards/rate-limit.guard';
import { RatingsModule } from './ratings/ratings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? 'test.env' : '.env',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getTypeOrmConfig,
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    AnimeModule,
    AnimeEpisodeModule,
    CommentModule,
    RatingsModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'files', 'videos'),
      serveRoot: '/videos',
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        url: configService.get('REDIS_URL'),
        type: 'single',
      }),
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [AnimeModule],
      inject: [AnimeService],
      driver: ApolloDriver,
      useFactory: (animeService: AnimeService) => ({
        autoSchemaFile: true,
        context: () => ({
          loaders: {
            episodeLoader: createEpisodeLoader(animeService),
          },
        }),
      }),
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude({ path: 'users/register', method: RequestMethod.POST })
      .exclude({ path: 'users/verify-email', method: RequestMethod.POST })
      .exclude({
        path: 'users/resend-verification',
        method: RequestMethod.POST,
      })
      .exclude({ path: 'auth/login', method: RequestMethod.POST })
      .forRoutes('*');
  }
}
