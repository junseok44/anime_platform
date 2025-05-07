import {
  IsString,
  IsNumber,
  IsDate,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class CreateAnimeEpisodeDto {
  @IsUUID()
  animeId: string;

  @IsString()
  title: string;

  @IsString()
  synopsis: string;

  @IsDate()
  uploadDate: Date;

  @IsNumber()
  runningTime: number;

  @IsOptional()
  @IsString()
  videoUrl?: string;
}
