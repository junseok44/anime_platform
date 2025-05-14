import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AnimeEpisode } from '../../anime-episode/entities/anime-episode.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Category } from './category.entity';
import { AnimeRating } from './anime-rating.entity';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

export enum AnimeType {
  TVA = 'tva',
  MOVIE = 'movie',
}

registerEnumType(AnimeType, {
  name: 'AnimeType',
  description: '애니메이션 타입',
});

@ObjectType()
@Entity()
export class Anime {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  title: string;

  @Field(() => [Category])
  @ManyToMany(() => Category, (category) => category.animes)
  @JoinTable()
  categories: Category[];

  @Field(() => AnimeType)
  @Column({
    type: 'enum',
    enum: AnimeType,
    default: AnimeType.TVA,
  })
  type: AnimeType;

  @Field(() => [Anime])
  @ManyToMany(() => Anime, (anime) => anime.relatedAnimes)
  @JoinTable()
  relatedAnimes: Anime[];

  @Field(() => [AnimeEpisode])
  @OneToMany(() => AnimeEpisode, (episode) => episode.anime)
  episodes: AnimeEpisode[];

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.anime)
  comments: Comment[];

  @Field(() => [AnimeRating])
  @OneToMany(() => AnimeRating, (rating) => rating.anime)
  ratings: AnimeRating[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
