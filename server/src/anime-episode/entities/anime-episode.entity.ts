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
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class AnimeEpisode {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Anime)
  @ManyToOne(() => Anime, (anime) => anime.episodes)
  anime: Anime;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column('text')
  synopsis: string;

  @Field()
  @Column()
  uploadDate: Date;

  @Field()
  @Column()
  runningTime: number; // in minutes

  @Field({ nullable: true })
  @Column({ nullable: true })
  @Transform(({ value }) => `${process.env.HOST}${value}`)
  videoPath: string; // 비디오 파일 경로

  @Field({ nullable: true })
  @Column({ nullable: true })
  thumbnailUrl: string; // 썸네일 이미지 경로

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.episode)
  comments: Comment[];

  @Field()
  @Column({ default: false })
  isExpired: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @Column({ default: 0 })
  viewCount: number;

  @Field()
  @Column({ default: 0 })
  likeCount: number;
}
