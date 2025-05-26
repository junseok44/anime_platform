import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Anime } from 'src/anime/entities/anime.entity';

@ObjectType()
@Entity()
@Index(['anime'])
@Unique(['anime', 'user'])
export class AnimeRating {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Anime)
  @ManyToOne(() => Anime, (anime) => anime.ratings)
  anime: Anime;

  @ManyToOne(() => User, (user) => user.animeRatings)
  user: User;

  @Field(() => Number)
  @Column('decimal', { precision: 2, scale: 1 })
  rating: number; // 0.0 ~ 5.0, 0.5 단위

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
