import { IsString, IsArray, IsEnum, IsOptional } from 'class-validator';
import { AnimeType } from '../entities/anime.entity';

export class CreateAnimeDto {
  @IsString()
  title: string;

  @IsArray()
  @IsString({ each: true })
  categories: string[];

  @IsEnum(AnimeType)
  type: AnimeType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  similarAnimeIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relatedAnimeIds?: string[];
}
