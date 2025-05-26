import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RatingResponse {
  @Field()
  rating: number;

  @Field()
  averageRating: number;
}
