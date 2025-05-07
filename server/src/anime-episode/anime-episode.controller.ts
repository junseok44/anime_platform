import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AnimeEpisodeService } from './anime-episode.service';
import { CreateAnimeEpisodeDto } from './dto/create-anime-episode.dto';
import { UpdateAnimeEpisodeDto } from './dto/update-anime-episode.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('anime-episodes')
export class AnimeEpisodeController {
  constructor(private readonly animeEpisodeService: AnimeEpisodeService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createAnimeEpisodeDto: CreateAnimeEpisodeDto) {
    return this.animeEpisodeService.create(createAnimeEpisodeDto);
  }

  @Get()
  findAll() {
    return this.animeEpisodeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.animeEpisodeService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateAnimeEpisodeDto: UpdateAnimeEpisodeDto,
  ) {
    return this.animeEpisodeService.update(id, updateAnimeEpisodeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.animeEpisodeService.remove(id);
  }

  @Get('anime/:animeId')
  findByAnimeId(@Param('animeId') animeId: string) {
    return this.animeEpisodeService.findByAnimeId(animeId);
  }

  @Patch(':id/expiration')
  @UseGuards(JwtAuthGuard)
  updateExpirationStatus(
    @Param('id') id: string,
    @Body('isExpired') isExpired: boolean,
  ) {
    return this.animeEpisodeService.updateExpirationStatus(id, isExpired);
  }
}
