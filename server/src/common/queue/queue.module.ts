import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EpisodeUploadProcessor } from './queue.processor';
import { AnimeProcessingProcessor } from './queue.processor';
import { RedisPubSubModule } from '../redis/redis-pubsub.module';
import { QueueService } from './queue.service';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
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
