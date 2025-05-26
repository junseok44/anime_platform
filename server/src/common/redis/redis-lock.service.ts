import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class RedisLockService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async acquireLock(key: string, ttl: number): Promise<string> {
    const lockValue = Math.random().toString(36).substring(2);
    const acquired = await this.redis.set(
      `lock:${key}`,
      lockValue,
      'EX',
      ttl,
      'NX',
    );

    if (!acquired) {
      throw new Error('Failed to acquire lock');
    }

    return lockValue;
  }

  async releaseLock(key: string): Promise<void> {
    await this.redis.del(`lock:${key}`);
  }
}
