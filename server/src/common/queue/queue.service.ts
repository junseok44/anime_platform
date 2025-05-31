import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QUEUE_JOB_KEYS, QUEUE_KEYS } from './queue-keys';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(QUEUE_KEYS.EPISODE_UPLOAD)
    private readonly episodeUploadQueue: Queue,
    @InjectQueue(QUEUE_KEYS.ANIME_PROCESSING)
    private readonly animeProcessingQueue: Queue,
  ) {}

  async addEpisodeUploadJob(data: {
    episodeId: string;
    videoPath: string;
    animeId: string;
    userId: string;
    episodeNumber: number;
    title: string;
  }) {
    return this.episodeUploadQueue.add(QUEUE_JOB_KEYS.PROCESS_UPLOAD, data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
  }

  async addAnimeProcessingJob(data: {
    animeId: string;
    type: 'create' | 'update';
    data: any;
  }) {
    return this.animeProcessingQueue.add(QUEUE_JOB_KEYS.PROCESS_ANIME, data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
  }
}
