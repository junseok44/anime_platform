import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Anime } from './anime.entity';
import { User } from '../../users/entities/user.entity';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity()
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
