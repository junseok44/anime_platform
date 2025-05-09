import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnimeEpisode } from './entities/anime-episode.entity';
import { CreateAnimeEpisodeDto } from './dto/create-anime-episode.dto';
import { UpdateAnimeEpisodeDto } from './dto/update-anime-episode.dto';
import { Anime } from '../anime/entities/anime.entity';

@Injectable()
export class AnimeEpisodeService {
  constructor(
    @InjectRepository(AnimeEpisode)
    private readonly animeEpisodeRepository: Repository<AnimeEpisode>,
    @InjectRepository(Anime)
    private readonly animeRepository: Repository<Anime>,
  ) {}

  async create(
    createAnimeEpisodeDto: CreateAnimeEpisodeDto,
  ): Promise<AnimeEpisode> {
    const anime = await this.animeRepository.findOne({
      where: { id: createAnimeEpisodeDto.animeId },
    });

    if (!anime) {
      throw new NotFoundException(
        `Anime with ID ${createAnimeEpisodeDto.animeId} not found`,
      );
    }

    const episode = new AnimeEpisode();
    episode.title = createAnimeEpisodeDto.title;
    episode.synopsis = createAnimeEpisodeDto.synopsis;
    episode.uploadDate = createAnimeEpisodeDto.uploadDate;
    episode.runningTime = createAnimeEpisodeDto.runningTime;
    episode.anime = anime;

    return await this.animeEpisodeRepository.save(episode);
  }

  async findAll(): Promise<AnimeEpisode[]> {
    return await this.animeEpisodeRepository.find({
      relations: ['anime', 'comments'],
    });
  }

  async findOne(id: string): Promise<AnimeEpisode> {
    const episode = await this.animeEpisodeRepository.findOne({
      where: { id },
      relations: ['anime', 'comments'],
    });

    if (!episode) {
      throw new NotFoundException(`Episode with ID ${id} not found`);
    }

    return episode;
  }

  async update(
    id: string,
    updateAnimeEpisodeDto: UpdateAnimeEpisodeDto,
  ): Promise<AnimeEpisode> {
    const episode = await this.findOne(id);

    if (updateAnimeEpisodeDto.title) {
      episode.title = updateAnimeEpisodeDto.title;
    }
    if (updateAnimeEpisodeDto.synopsis) {
      episode.synopsis = updateAnimeEpisodeDto.synopsis;
    }
    if (updateAnimeEpisodeDto.uploadDate) {
      episode.uploadDate = updateAnimeEpisodeDto.uploadDate;
    }
    if (updateAnimeEpisodeDto.runningTime) {
      episode.runningTime = updateAnimeEpisodeDto.runningTime;
    }

    return await this.animeEpisodeRepository.save(episode);
  }

  async remove(id: string): Promise<void> {
    const result = await this.animeEpisodeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Episode with ID ${id} not found`);
    }
  }

  async findByAnimeId(animeId: string): Promise<AnimeEpisode[]> {
    return await this.animeEpisodeRepository.find({
      where: { anime: { id: animeId } },
      relations: ['comments'],
      order: {
        uploadDate: 'ASC',
      },
    });
  }

  async updateExpirationStatus(
    id: string,
    isExpired: boolean,
  ): Promise<AnimeEpisode> {
    const episode = await this.findOne(id);
    episode.isExpired = isExpired;
    return await this.animeEpisodeRepository.save(episode);
  }
}
