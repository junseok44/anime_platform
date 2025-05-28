import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisPubSubService } from '../common/redis/redis-pubsub.service';
import { User } from '../users/entities/user.entity';
import { Anime } from '../anime/entities/anime.entity';

@Injectable()
export class NotificationsService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Anime)
    private readonly animeRepository: Repository<Anime>,
    private readonly redisPubSubService: RedisPubSubService,
  ) {}

  async onModuleInit() {
    await this.redisPubSubService.subscribe('new-episode', async (message) => {
      await this.handleNewEpisode(message);
    });
  }

  private async handleNewEpisode(message: {
    userId: string;
    animeId: string;
    episodeId: string;
    episodeNumber: number;
    title: string;
  }) {
    const user = await this.userRepository.findOne({
      where: { id: message.userId },
    });

    if (!user) return;

    console.log(
      `새로운 에피소드 알림: ${user.nickname}님, ${message.title}의 ${message.episodeNumber}화가 업로드되었습니다.`,
    );
  }
}
