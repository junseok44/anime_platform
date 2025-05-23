import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  SetMetadata,
} from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { Reflector } from '@nestjs/core';

export interface RateLimitOptions {
  limit: number;
  window: number;
  message?: string;
}

export const RATE_LIMIT_KEY = 'rate-limit';
export const RateLimit = (options: RateLimitOptions) =>
  SetMetadata(RATE_LIMIT_KEY, options);

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly defaultMessage =
    '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.';

  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const options = this.reflector.get<RateLimitOptions>(
      RATE_LIMIT_KEY,
      context.getHandler(),
    );

    if (!options) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const ip = request.ip;
    const key = `rate-limit:${ip}`;

    const current = await this.redis.incr(key);
    if (current === 1) {
      await this.redis.expire(key, options.window);
    }

    if (current > options.limit) {
      throw new HttpException(
        options.message || this.defaultMessage,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
