import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimeEpisodeService } from './anime-episode.service';
import { AnimeEpisodeController } from './anime-episode.controller';
import { AnimeEpisode } from './entities/anime-episode.entity';
import { Anime } from '../anime/entities/anime.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { v4 } from 'uuid';
import { NotificationsModule } from '../notifications/notifications.module';
import { RedisPubSubModule } from 'src/common/redis/redis-pubsub.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnimeEpisode, Anime]),
    MulterModule.register({
      storage: diskStorage({
        destination: join(process.cwd(), 'files', 'videos'),
        filename: (req, file, cb) => {
          const split = file.originalname.split('.');
          const extension = split.length > 1 ? split[split.length - 1] : 'mp4';
          cb(null, `${v4()}_${Date.now()}.${extension}`);
        },
      }),
    }),
    NotificationsModule,
    RedisPubSubModule,
  ],
  controllers: [AnimeEpisodeController],
  providers: [AnimeEpisodeService],
  exports: [AnimeEpisodeService],
})
export class AnimeEpisodeModule {}
