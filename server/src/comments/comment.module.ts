import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Comment } from './entities/comment.entity';
import { AnimeModule } from '../anime/anime.module';
import { AnimeEpisodeModule } from '../anime-episode/anime-episode.module';
import { AnimeRating } from 'src/ratings/entities/anime-rating.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, AnimeRating]),
    AnimeModule,
    AnimeEpisodeModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
