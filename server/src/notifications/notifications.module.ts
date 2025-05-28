import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { RedisPubSubModule } from '../common/redis/redis-pubsub.module';
import { User } from '../users/entities/user.entity';
import { Anime } from '../anime/entities/anime.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Anime]), RedisPubSubModule],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
