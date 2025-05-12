import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimeService } from './anime.service';
import { AnimeController } from './anime.controller';
import { Anime } from './entities/anime.entity';
import { Category } from './entities/category.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Anime, Category])],
  controllers: [AnimeController, CategoryController],
  providers: [AnimeService, CategoryService],
  exports: [AnimeService],
})
export class AnimeModule {}
