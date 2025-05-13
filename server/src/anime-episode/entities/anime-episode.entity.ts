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
import { Transform } from 'class-transformer';

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

  @Column({ nullable: true })
  @Transform(({ value }) => `${process.env.HOST}${value}`)
  videoPath: string; // 비디오 파일 경로

  @Column({ nullable: true })
  thumbnailUrl: string; // 썸네일 이미지 경로

  @OneToMany(() => Comment, (comment) => comment.episode)
  comments: Comment[];

  @Column({ default: false })
  isExpired: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
