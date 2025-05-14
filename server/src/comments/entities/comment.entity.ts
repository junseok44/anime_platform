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
import { ObjectType, Field, ID } from '@nestjs/graphql';

export enum CommentType {
  REVIEW = 'review',
  EPISODE_COMMENT = 'episode_comment',
}

@ObjectType()
@Entity()
export class Comment {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: CommentType,
  })
  type: CommentType;

  @Field()
  @Column('text')
  content: string;

  @ManyToOne(() => User)
  author: User;

  @Field(() => Anime)
  @ManyToOne(() => Anime, (anime) => anime.comments)
  anime: Anime;

  @Field(() => AnimeEpisode, { nullable: true })
  @ManyToOne(() => AnimeEpisode, (episode) => episode.comments, {
    nullable: true,
  })
  episode: AnimeEpisode;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: false })
  isDeleted: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
