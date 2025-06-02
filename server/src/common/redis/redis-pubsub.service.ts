import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisPubSubService {
  private publisher: Redis;
  private subscriber: Redis;

  constructor(@InjectRedis() private readonly redis: Redis) {
    this.publisher = this.redis.duplicate();
    this.subscriber = this.redis.duplicate();
  }

  async publish(channel: string, message: any) {
    await this.publisher.publish(channel, JSON.stringify(message));
  }

  async subscribe(channel: string, callback: (message: any) => void) {
    await this.subscriber.subscribe(channel); // ← 여기서만 구독
    this.subscriber.on('message', (ch, message) => {
      if (ch === channel) {
        callback(JSON.parse(message));
      }
    });
  }
}
