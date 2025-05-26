import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { RedisLockService } from '../common/redis/redis-lock.service';
import { AnimeRating } from './entities/anime-rating.entity';
import { Anime } from 'src/anime/entities/anime.entity';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { REDIS_KEYS } from 'src/common/redis/redis-keys';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(AnimeRating)
    private readonly ratingRepository: Repository<AnimeRating>,
    @InjectRepository(Anime)
    private readonly animeRepository: Repository<Anime>,
    private readonly redisLockService: RedisLockService,
    private readonly dataSource: DataSource,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async updateAnimeRating(animeId: string, userId: string, rating: number) {
    const lock = await this.redisLockService.acquireLock(
      REDIS_KEYS.ANIME.RATING.LOCK(animeId),
      10,
    );

    try {
      return await this.dataSource.transaction(
        'SERIALIZABLE',
        async (manager: EntityManager) => {
          const ratingRepository = manager.getRepository(AnimeRating);

          // 비관적 락 사용
          let animeRating = await ratingRepository.findOne({
            where: { anime: { id: animeId }, user: { id: userId } },
            lock: { mode: 'pessimistic_write' },
          });

          if (animeRating) {
            animeRating.rating = rating;
            await ratingRepository.save(animeRating);
          } else {
            animeRating = ratingRepository.create({
              anime: { id: animeId },
              user: { id: userId },
              rating,
            });
            await ratingRepository.save(animeRating);
          }

          // 평균 평점 계산 시에도 락 사용
          const averageRating = await this.getAnimeAverageRating(
            animeId,
            manager,
          );

          // Anime 엔티티 업데이트 시에도 락 사용
          await manager
            .createQueryBuilder()
            .update(Anime)
            .set({ averageRating })
            .where('id = :animeId', { animeId })
            .execute();

          return {
            rating: animeRating.rating,
            averageRating,
          };
        },
      );
    } finally {
      await this.redisLockService.releaseLock(lock);
    }
  }

  async getAnimeAverageRating(
    animeId: string,
    manager?: EntityManager,
  ): Promise<number> {
    const key = REDIS_KEYS.ANIME.RATING.AVG(animeId);
    const cached = await this.redis.get(key);

    if (cached) return parseFloat(cached);

    const repo = manager?.getRepository(AnimeRating) ?? this.ratingRepository;

    const { avg } = await repo
      .createQueryBuilder('rating')
      .select('AVG(rating.rating)', 'avg')
      .where('rating.anime.id = :animeId', { animeId })
      .getRawOne();

    const averageRating = parseFloat(avg) || 0;

    const fixedAverage = parseFloat(avg).toFixed(2);
    await this.redis.set(key, fixedAverage.toString(), 'EX', 60 * 60 * 24);

    return averageRating;
  }
}
