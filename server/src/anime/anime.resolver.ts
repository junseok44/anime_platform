import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';
import { AnimeService } from './anime.service';
import { Anime } from './entities/anime.entity';
import { CreateAnimeInput } from './dto/create-anime.input';
import { UpdateAnimeInput } from './dto/update-anime.input';
import { AnimeEpisode } from 'src/anime-episode/entities/anime-episode.entity';

@Resolver(() => Anime)
export class AnimeResolver {
  constructor(private readonly animeService: AnimeService) {}

  @Query(() => [Anime])
  async animes(): Promise<Anime[]> {
    return this.animeService.findAll();
  }

  @Query(() => Anime)
  async anime(@Args('id', { type: () => ID }) id: string): Promise<Anime> {
    return this.animeService.findOne(id);
  }

  @Mutation(() => Anime)
  async createAnime(
    @Args('createAnimeInput') createAnimeInput: CreateAnimeInput,
  ): Promise<Anime> {
    return this.animeService.create(createAnimeInput);
  }

  @Mutation(() => Anime)
  async updateAnime(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateAnimeInput') updateAnimeInput: UpdateAnimeInput,
  ): Promise<Anime> {
    return this.animeService.update(id, updateAnimeInput);
  }

  @Mutation(() => Anime)
  async removeAnime(@Args('id', { type: () => ID }) id: string): Promise<void> {
    return this.animeService.remove(id);
  }

  @ResolveField(() => [AnimeEpisode])
  async episodes(
    @Parent() anime: Anime,
    @Context('loaders') loaders,
  ): Promise<AnimeEpisode[]> {
    const episodes = await loaders.episodeLoader.load(anime.id);
    return episodes;
  }
}
