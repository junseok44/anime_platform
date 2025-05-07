import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Anime } from './entities/anime.entity';
import { CreateAnimeDto } from './dto/create-anime.dto';
import { UpdateAnimeDto } from './dto/update-anime.dto';

@Injectable()
export class AnimeService {
  constructor(
    @InjectRepository(Anime)
    private animeRepository: Repository<Anime>,
  ) {}

  async create(createAnimeDto: CreateAnimeDto): Promise<Anime> {
    const anime = this.animeRepository.create(createAnimeDto);
    return await this.animeRepository.save(anime);
  }

  async findAll(): Promise<Anime[]> {
    return await this.animeRepository.find({
      relations: ['episodes', 'similarAnimes', 'relatedAnimes'],
    });
  }

  async findOne(id: string): Promise<Anime> {
    const anime = await this.animeRepository.findOne({
      where: { id },
      relations: ['episodes', 'similarAnimes', 'relatedAnimes', 'reviews'],
    });

    if (!anime) {
      throw new NotFoundException(`Anime with ID ${id} not found`);
    }

    return anime;
  }

  async update(id: string, updateAnimeDto: UpdateAnimeDto): Promise<Anime> {
    const anime = await this.findOne(id);
    Object.assign(anime, updateAnimeDto);
    return await this.animeRepository.save(anime);
  }

  async remove(id: string): Promise<void> {
    const result = await this.animeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Anime with ID ${id} not found`);
    }
  }

  async addSimilarAnime(
    animeId: string,
    similarAnimeId: string,
  ): Promise<Anime> {
    const anime = await this.findOne(animeId);
    const similarAnime = await this.findOne(similarAnimeId);

    if (!anime.similarAnimes) {
      anime.similarAnimes = [];
    }

    anime.similarAnimes.push(similarAnime);
    return await this.animeRepository.save(anime);
  }

  async addRelatedAnime(
    animeId: string,
    relatedAnimeId: string,
  ): Promise<Anime> {
    const anime = await this.findOne(animeId);
    const relatedAnime = await this.findOne(relatedAnimeId);

    if (!anime.relatedAnimes) {
      anime.relatedAnimes = [];
    }

    anime.relatedAnimes.push(relatedAnime);
    return await this.animeRepository.save(anime);
  }
}
