import {
  IsString,
  IsNumber,
  IsDate,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateAnimeEpisodeDto {
  @ApiProperty({
    example: 'asdf-asdf-asdf-asdf',
    description: '속한 애니메이션의 id',
  })
  @IsUUID()
  animeId: string;

  @ApiProperty({
    example: '인류의 적, 거인이 나타났다.',
    description: '에피소드 줄거리',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: '인류의 적, 거인이 나타났다.',
    description: '에피소드 줄거리',
  })
  @IsString()
  synopsis: string;

  @ApiProperty({
    example: '2024-03-20T00:00:00Z',
    description: '업로드 날짜',
  })
  @IsDate()
  @Type(() => Date)
  uploadDate: Date;

  @ApiProperty({
    example: 24,
    description: '에피소드 길이(분)',
  })
  @IsNumber()
  runningTime: number;

  @ApiProperty({
    example: 1,
    description: '에피소드 번호',
  })
  @IsNumber()
  episodeNumber: number;

  @ApiProperty({
    example: 24,
    description: '에피소드 길이(분)',
  })
  @IsNumber()
  @IsOptional()
  duration?: number;

  @ApiProperty({
    example: 'https://example.com/thumbnail.jpg',
    description: '에피소드 썸네일 URL',
  })
  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: '에피소드 비디오 파일',
  })
  @IsOptional()
  video?: Express.Multer.File;
}
