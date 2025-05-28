import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimeController } from './anime.controller';
import { AnimeResolver } from './anime.resolver';
import { AnimeService } from './anime.service';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Anime } from './entities/anime.entity';
import { Category } from './entities/category.entity';
import { AnimeEpisode } from 'src/anime-episode/entities/anime-episode.entity';
import { PopularAnimeService } from './popular-anime.service';
import { PopularAnimeController } from './popular-anime.controller';
import { RateLimitGuard } from 'src/common/guards/rate-limit.guard';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Anime, Category, AnimeEpisode, User])],
  controllers: [AnimeController, CategoryController, PopularAnimeController],
  providers: [
    AnimeService,
    CategoryService,
    AnimeResolver,
    PopularAnimeService,
    RateLimitGuard,
  ],
  exports: [AnimeService, PopularAnimeService],
})
export class AnimeModule {}
