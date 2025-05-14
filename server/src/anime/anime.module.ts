import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimeController } from './anime.controller';
import { AnimeResolver } from './anime.resolver';
import { AnimeService } from './anime.service';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Anime } from './entities/anime.entity';
import { Category } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Anime, Category])],
  controllers: [AnimeController, CategoryController],
  providers: [AnimeService, CategoryService, AnimeResolver],
  exports: [AnimeService],
})
export class AnimeModule {}
