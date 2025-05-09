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

export enum AnimeType {
  TVA = 'tva',
  MOVIE = 'movie',
}

@Entity()
export class Anime {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @ManyToMany(() => Category, (category) => category.animes)
  @JoinTable()
  categories: Category[];

  @Column({
    type: 'enum',
    enum: AnimeType,
    default: AnimeType.TVA,
  })
  type: AnimeType;

  @ManyToMany(() => Anime, (anime) => anime.relatedAnimes)
  @JoinTable()
  relatedAnimes: Anime[];

  @OneToMany(() => AnimeEpisode, (episode) => episode.anime)
  episodes: AnimeEpisode[];

  @OneToMany(() => Comment, (comment) => comment.anime)
  comments: Comment[];

  @OneToMany(() => AnimeRating, (rating) => rating.anime)
  ratings: AnimeRating[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
