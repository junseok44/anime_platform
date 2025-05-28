import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class RedisPubSubService implements OnModuleInit, OnModuleDestroy {
  private publisher: Redis;
  private subscriber: Redis;

  constructor(@InjectRedis() private readonly redis: Redis) {
    this.publisher = this.redis.duplicate();
    this.subscriber = this.redis.duplicate();
  }

  async onModuleInit() {
    await this.subscriber.subscribe('new-episode');
  }

  async onModuleDestroy() {
    await this.subscriber.unsubscribe('new-episode');
    await this.publisher.quit();
    await this.subscriber.quit();
  }

  async publish(channel: string, message: any) {
    await this.publisher.publish(channel, JSON.stringify(message));
  }

  async subscribe(channel: string, callback: (message: any) => void) {
    this.subscriber.on('message', (ch, message) => {
      if (ch === channel) {
        callback(JSON.parse(message));
      }
    });
  }
}
