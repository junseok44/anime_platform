import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { UpdateRatingInput } from './dto/update-rating.input';
import { RatingResponse } from './dto/rating.response';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver()
export class RatingsResolver {
  constructor(private readonly ratingsService: RatingsService) {}

  @Mutation(() => RatingResponse)
  @UseGuards(JwtAuthGuard)
  async updateAnimeRating(
    @CurrentUser() user: User,
    @Args('input') input: UpdateRatingInput,
  ) {
    return this.ratingsService.updateAnimeRating(
      input.animeId,
      user.id,
      input.rating,
    );
  }
}
