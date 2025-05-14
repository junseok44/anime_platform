import { InputType, Field, ID } from '@nestjs/graphql';
import { CreateAnimeInput } from './create-anime.input';

@InputType()
export class UpdateAnimeInput extends CreateAnimeInput {
  @Field(() => ID)
  id: string;
}
