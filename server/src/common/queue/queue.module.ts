import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EpisodeUploadProcessor } from './queue.processor';
import { AnimeProcessingProcessor } from './queue.processor';
import { RedisPubSubModule } from '../redis/redis-pubsub.module';
import { QueueService } from './queue.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: configService.get('REDIS_URL'),
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      {
        name: 'episode-upload',
      },
      {
        name: 'anime-processing',
      },
    ),
    RedisPubSubModule,
  ],
  providers: [QueueService, EpisodeUploadProcessor, AnimeProcessingProcessor],
  exports: [QueueService],
})
export class QueueModule {}
