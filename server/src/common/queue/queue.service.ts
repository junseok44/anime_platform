import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('episode-upload')
    private readonly episodeUploadQueue: Queue,
    @InjectQueue('anime-processing')
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
    return this.episodeUploadQueue.add('process-upload', data, {
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
    return this.animeProcessingQueue.add('process-anime', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
  }
}
