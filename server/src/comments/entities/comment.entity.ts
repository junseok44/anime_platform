import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Anime } from '../../anime/entities/anime.entity';
import { AnimeEpisode } from '../../anime-episode/entities/anime-episode.entity';

export enum CommentType {
  REVIEW = 'review',
  EPISODE_COMMENT = 'episode_comment',
}

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: CommentType,
  })
  type: CommentType;

  @Column('text')
  content: string;

  @ManyToOne(() => User)
  author: User;

  @ManyToOne(() => Anime, { nullable: true })
  anime: Anime;

  @ManyToOne(() => AnimeEpisode, { nullable: true })
  episode: AnimeEpisode;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
