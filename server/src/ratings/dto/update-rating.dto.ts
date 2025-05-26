// src/ratings/dto/update-rating.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID, Max, Min } from 'class-validator';

export class UpdateRatingDto {
  @ApiProperty({
    description: '애니메이션 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsUUID()
  animeId: string;

  @ApiProperty({
    description: '평점 (1.0 ~ 5.0)',
    example: 4.5,
    minimum: 1.0,
    maximum: 5.0,
    type: Number,
  })
  @IsNumber()
  @Min(1.0)
  @Max(5.0)
  rating: number;
}
