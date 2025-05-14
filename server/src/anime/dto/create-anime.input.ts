import { InputType, Field } from '@nestjs/graphql';
import { AnimeType } from '../entities/anime.entity';

@InputType()
export class CreateAnimeInput {
  @Field()
  title: string;

  @Field(() => [String])
  categories: string[];

  @Field(() => AnimeType, { defaultValue: AnimeType.TVA })
  type: AnimeType;

  @Field(() => [String], { nullable: true })
  relatedAnimeIds?: string[];
}
