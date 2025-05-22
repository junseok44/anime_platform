import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Anime } from './entities/anime.entity';
import { AnimeEpisode } from '../anime-episode/entities/anime-episode.entity';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class PopularAnimeService {
  private readonly REDIS_RANKING_KEY = 'anime:ranking';
  private readonly REDIS_ANIME_EPISODE_MAP_KEY = 'anime:episode:map';

  constructor(
    @InjectRedis() private readonly redis: Redis,
    @InjectRepository(Anime)
    private readonly animeRepository: Repository<Anime>,
    @InjectRepository(AnimeEpisode)
    private readonly episodeRepository: Repository<AnimeEpisode>,
  ) {}

  // ✅ 실시간 인기 애니 가져오기 (animeId만 Redis에서)
  async getPopularAnime(limit = 10): Promise<Anime[]> {
    const animeIds = await this.redis.zrevrange(
      this.REDIS_RANKING_KEY,
      0,
      limit - 1,
    );

    if (animeIds.length === 0) return [];

    // 원래 순서를 유지하려면 순서대로 찾아야 함
    const animes = await this.animeRepository.find({
      where: { id: In(animeIds) },
    });

    return animes;
  }

  // ✅ 조회수 증가 시 랭킹 점수 반영
  async incrementEpisodePopularity(episodeId: string): Promise<void> {
    // 1. Redis에서 episodeId → animeId 매핑 가져오기
    let animeId = await this.redis.hget(
      this.REDIS_ANIME_EPISODE_MAP_KEY,
      episodeId,
    );

    // 2. 캐시에 없으면 DB 조회 후 Redis에 저장
    if (!animeId) {
      const episode = await this.episodeRepository.findOne({
        where: { id: episodeId },
        relations: ['anime'],
      });

      if (!episode?.anime?.id) return;

      animeId = episode.anime.id;

      // Redis에 매핑 저장
      await this.redis.hset(
        this.REDIS_ANIME_EPISODE_MAP_KEY,
        episodeId,
        animeId,
      );
    }

    // 3. Redis 점수 증가 (랭킹용)
    await this.redis.zincrby(this.REDIS_RANKING_KEY, 1, animeId);

    // 4. DB에 viewCount 증가 (확정적 저장)
    await this.episodeRepository.increment({ id: episodeId }, 'viewCount', 1);
  }

  // ✅ 좋아요 시 점수 반영 (가중치를 더 줄 수도 있음)
  async likeEpisode(episodeId: string): Promise<void> {
    // 1. Redis에서 episodeId → animeId 매핑 가져오기
    let animeId = await this.redis.hget(
      this.REDIS_ANIME_EPISODE_MAP_KEY,
      episodeId,
    );

    // 2. 캐시에 없으면 DB 조회 후 Redis에 저장
    if (!animeId) {
      const episode = await this.episodeRepository.findOne({
        where: { id: episodeId },
        relations: ['anime'],
      });

      if (!episode?.anime?.id) return;

      animeId = episode.anime.id;

      // Redis에 매핑 저장
      await this.redis.hset(
        this.REDIS_ANIME_EPISODE_MAP_KEY,
        episodeId,
        animeId,
      );
    }

    // 3. Redis 점수 증가 (랭킹용)
    await this.redis.zincrby(this.REDIS_RANKING_KEY, 3, animeId);

    // 4. DB에 likeCount 증가 (확정적 저장)
    await this.episodeRepository.increment({ id: episodeId }, 'likeCount', 1);
  }
}
