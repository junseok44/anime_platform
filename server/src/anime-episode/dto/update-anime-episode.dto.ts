import { PartialType } from '@nestjs/swagger';
import { CreateAnimeEpisodeDto } from './create-anime-episode.dto';

export class UpdateAnimeEpisodeDto extends PartialType(CreateAnimeEpisodeDto) {}
