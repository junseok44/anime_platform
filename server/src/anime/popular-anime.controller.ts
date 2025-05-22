import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { PopularAnimeService } from './popular-anime.service';
import { Anime } from './entities/anime.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

class EpisodeIdDto {
  @ApiProperty({
    description: '에피소드 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  episodeId: string;
}

@Controller('popular-anime')
export class PopularAnimeController {
  constructor(private readonly popularAnimeService: PopularAnimeService) {}

  @Get()
  async getPopularAnime(@Query('limit') limit?: number): Promise<Anime[]> {
    return this.popularAnimeService.getPopularAnime(limit);
  }

  @Post('view')
  async incrementEpisodePopularity(@Body() dto: EpisodeIdDto) {
    await this.popularAnimeService.incrementEpisodePopularity(dto.episodeId);
    return { success: true };
  }

  @Post('like')
  async likeEpisode(@Body() dto: EpisodeIdDto) {
    await this.popularAnimeService.likeEpisode(dto.episodeId);
    return { success: true };
  }
}
