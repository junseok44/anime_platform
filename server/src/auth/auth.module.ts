import {
  forwardRef,
  Module,
  NestModule,
  MiddlewareConsumer,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtMiddleware } from './middleware/jwt.middleware';
import { ENV_VARIABLE_KEYS } from 'src/common/config/env.validation';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(ENV_VARIABLE_KEYS.JWT_SECRET),
        signOptions: {
          expiresIn: configService.get(ENV_VARIABLE_KEYS.JWT_EXPIRES_IN),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard, JwtModule],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}
