import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Anime } from '../../anime/entities/anime.entity';
import { Comment } from '../../comments/entities/comment.entity';

@Entity()
export class AnimeEpisode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Anime, (anime) => anime.episodes)
  anime: Anime;

  @Column()
  title: string;

  @Column('text')
  synopsis: string;

  @Column()
  uploadDate: Date;

  @Column()
  runningTime: number; // in minutes

  @OneToMany(() => Comment, (comment) => comment.episode)
  comments: Comment[];

  @Column({ default: false })
  isExpired: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
