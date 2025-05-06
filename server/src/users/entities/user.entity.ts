import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column({ unique: true })
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9가-힣]+$/, {
    message: '닉네임은 영문, 숫자, 한글만 사용 가능합니다.',
  })
  nickname: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @Exclude()
  @IsString()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message: '비밀번호는 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.',
    },
  )
  password: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  @IsString()
  @Exclude()
  emailVerificationCode: string;

  @Column({ nullable: true })
  @Exclude()
  emailVerificationCodeExpires: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
