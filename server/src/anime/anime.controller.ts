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
import { AnimeService } from './anime.service';
import { CreateAnimeDto } from './dto/create-anime.dto';
import { UpdateAnimeDto } from './dto/update-anime.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('anime')
export class AnimeController {
  constructor(private readonly animeService: AnimeService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createAnimeDto: CreateAnimeDto) {
    return this.animeService.create(createAnimeDto);
  }

  @Get()
  findAll() {
    return this.animeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.animeService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateAnimeDto: UpdateAnimeDto) {
    return this.animeService.update(id, updateAnimeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.animeService.remove(id);
  }

  @Post(':id/similar/:similarId')
  @UseGuards(JwtAuthGuard)
  addSimilarAnime(
    @Param('id') id: string,
    @Param('similarId') similarId: string,
  ) {
    return this.animeService.addSimilarAnime(id, similarId);
  }

  @Post(':id/related/:relatedId')
  @UseGuards(JwtAuthGuard)
  addRelatedAnime(
    @Param('id') id: string,
    @Param('relatedId') relatedId: string,
  ) {
    return this.animeService.addRelatedAnime(id, relatedId);
  }
}
