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

@Module({
  imports: [TypeOrmModule.forFeature([Anime, Category, AnimeEpisode])],
  controllers: [AnimeController, CategoryController],
  providers: [AnimeService, CategoryService, AnimeResolver],
  exports: [AnimeService],
})
export class AnimeModule {}
