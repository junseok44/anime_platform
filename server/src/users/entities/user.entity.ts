import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { Comment } from '../../comments/entities/comment.entity';
import { ApiHideProperty } from '@nestjs/swagger';
import { AnimeRating } from 'src/ratings/entities/anime-rating.entity';
import { Anime } from 'src/anime/entities/anime.entity';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity('user')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  @ApiHideProperty()
  id: string;

  @Field()
  @Column({ unique: true })
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9가-힣]+$/, {
    message: '닉네임은 영문, 숫자, 한글만 사용 가능합니다.',
  })
  nickname: string;

  @Field()
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @Exclude()
  @IsString()
  @MinLength(8)
  @ApiHideProperty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message: '비밀번호는 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.',
    },
  )
  password: string;

  @Field()
  @Column({ default: false })
  @ApiHideProperty()
  isEmailVerified: boolean;

  @Column({ nullable: true })
  @IsString()
  @Exclude()
  @ApiHideProperty()
  emailVerificationCode: string;

  @Column({ nullable: true })
  @Exclude()
  @ApiHideProperty()
  emailVerificationCodeExpires: Date;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => [AnimeRating])
  @OneToMany(() => AnimeRating, (rating) => rating.user)
  animeRatings: AnimeRating[];

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @Field(() => [Anime])
  @ManyToMany(() => Anime, (anime) => anime.likedBy)
  likedAnimes: Anime[];
}
