import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Controller('ratings')
@ApiTags('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  @ApiOperation({ summary: '애니메이션 평점 업데이트' })
  @ApiResponse({ status: 200, description: '애니메이션 평점 업데이트 성공' })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청' })
  @ApiResponse({ status: 404, description: '애니메이션을 찾을 수 없음' })
  @UseGuards(JwtAuthGuard)
  async updateAnimeRating(
    @CurrentUser() user: User,
    @Body() updateRatingDto: UpdateRatingDto,
  ) {
    return this.ratingsService.updateAnimeRating(
      updateRatingDto.animeId,
      user.id,
      updateRatingDto.rating,
    );
  }
}
