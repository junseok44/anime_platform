import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateRatingInput {
  @Field()
  animeId: string;

  @Field()
  rating: number;
}
