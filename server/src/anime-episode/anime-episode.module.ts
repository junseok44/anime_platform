import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimeEpisodeService } from './anime-episode.service';
import { AnimeEpisodeController } from './anime-episode.controller';
import { AnimeEpisode } from './entities/anime-episode.entity';
import { AnimeModule } from '../anime/anime.module';

@Module({
  imports: [TypeOrmModule.forFeature([AnimeEpisode]), AnimeModule],
  controllers: [AnimeEpisodeController],
  providers: [AnimeEpisodeService],
  exports: [AnimeEpisodeService],
})
export class AnimeEpisodeModule {}
