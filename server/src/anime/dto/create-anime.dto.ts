import { IsString, IsEnum, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AnimeType } from '../entities/anime.entity';

export class CreateAnimeDto {
  @ApiProperty({
    example: '진격의 거인',
    description: '애니메이션 제목',
  })
  @IsString()
  title: string;

  @ApiProperty({
    enum: AnimeType,
    example: AnimeType.TVA,
    description: '애니메이션 타입 (TVA 또는 MOVIE)',
  })
  @IsEnum(AnimeType)
  type: AnimeType;

  @ApiProperty({
    example: ['액션', '판타지'],
    description: '카테고리 이름 배열',
  })
  @IsArray()
  @IsString({ each: true })
  categories: string[];

  @ApiProperty({
    example: ['귀멸의 칼날', '진격의 거인 시즌2'],
    description: '연관된 애니메이션 ID 배열',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relatedAnimeIds?: string[];
}
