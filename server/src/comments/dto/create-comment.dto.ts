import { IsString, IsEnum, IsUUID, IsOptional } from 'class-validator';
import { CommentType } from '../entities/comment.entity';

export class CreateCommentDto {
  @IsEnum(CommentType)
  type: CommentType;

  @IsString()
  content: string;

  @IsUUID()
  @IsOptional()
  animeId?: string;

  @IsUUID()
  @IsOptional()
  episodeId?: string;
}
