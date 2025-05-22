import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'junseok@naver.com',
    description: '사용자 이메일',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'qwer1234@!',
    description: '사용자 비밀번호',
  })
  @IsString()
  @MinLength(8)
  password: string;
}
