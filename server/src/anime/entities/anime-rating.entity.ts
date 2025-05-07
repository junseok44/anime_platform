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

@Entity()
export class AnimeRating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Anime, (anime) => anime.ratings)
  anime: Anime;

  @ManyToOne(() => User, (user) => user.animeRatings)
  user: User;

  @Column('decimal', { precision: 2, scale: 1 })
  rating: number; // 0.0 ~ 5.0, 0.5 단위

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
