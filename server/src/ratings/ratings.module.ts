import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingsService } from './ratings.service';
import { RatingsResolver } from './ratings.resolver';
import { RatingsController } from './ratings.controller';
import { AnimeRating } from './entities/anime-rating.entity';
import { Anime } from 'src/anime/entities/anime.entity';
import { RedisLockService } from 'src/common/redis/redis-lock.service';

@Module({
  imports: [TypeOrmModule.forFeature([AnimeRating, Anime])],
  providers: [RatingsService, RatingsResolver, RedisLockService],
  controllers: [RatingsController],
  exports: [RatingsService],
})
export class RatingsModule {}
