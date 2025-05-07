import { PartialType } from '@nestjs/mapped-types';
import { CreateAnimeEpisodeDto } from './create-anime-episode.dto';

export class UpdateAnimeEpisodeDto extends PartialType(CreateAnimeEpisodeDto) {}
