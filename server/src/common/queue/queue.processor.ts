import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { RedisPubSubService } from '../redis/redis-pubsub.service';

@Processor('episode-upload')
export class EpisodeUploadProcessor {
  private readonly logger = new Logger(EpisodeUploadProcessor.name);

  constructor(private readonly redisPubSubService: RedisPubSubService) {}

  @Process('process-upload')
  async handleUpload(job: Job) {
    // 여기서 비디오 처리 로직을 구현할 수 있습니다
    // 예: 비디오 인코딩, 썸네일 생성 등

    // 알림 전송
    // await this.redisPubSubService.publish('new-episode', {
    //   userId: job.data.userId,
    //   animeId: job.data.animeId,
    //   episodeId: job.data.episodeId,
    //   episodeNumber: job.data.episodeNumber,
    //   title: job.data.title,
    // });

    return { success: true };
  }
}

@Processor('anime-processing')
export class AnimeProcessingProcessor {
  private readonly logger = new Logger(AnimeProcessingProcessor.name);

  @Process('process-anime')
  async handleAnimeProcessing(job: Job) {
    this.logger.debug('Processing anime data...');
    this.logger.debug(job.data);

    // 여기서 애니메이션 데이터 처리 로직을 구현할 수 있습니다
    // 예: 메타데이터 추출, 관련 데이터 처리 등

    return { success: true };
  }
}
