import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Anime } from './entities/anime.entity';
import { CreateAnimeDto } from './dto/create-anime.dto';
import { UpdateAnimeDto } from './dto/update-anime.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class AnimeService {
  constructor(
    @InjectRepository(Anime)
    private readonly animeRepository: Repository<Anime>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createAnimeDto: CreateAnimeDto): Promise<Anime> {
    const anime = new Anime();
    anime.title = createAnimeDto.title;
    anime.type = createAnimeDto.type;

    if (createAnimeDto.categories) {
      anime.categories = await Promise.all(
        createAnimeDto.categories.map((categoryName) =>
          this.categoryRepository.findOne({ where: { name: categoryName } }),
        ),
      );
    }

    if (createAnimeDto.relatedAnimeIds) {
      anime.relatedAnimes = await Promise.all(
        createAnimeDto.relatedAnimeIds.map((animeId) =>
          this.animeRepository.findOne({ where: { id: animeId } }),
        ),
      );
    }

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

    // 기본 필드 업데이트
    if (updateAnimeDto.title) {
      anime.title = updateAnimeDto.title;
    }
    if (updateAnimeDto.type) {
      anime.type = updateAnimeDto.type;
    }

    // 카테고리 업데이트
    if (updateAnimeDto.categories) {
      anime.categories = await Promise.all(
        updateAnimeDto.categories.map((categoryName) =>
          this.categoryRepository.findOne({ where: { name: categoryName } }),
        ),
      );
    }

    // 관련 애니메이션 업데이트
    if (updateAnimeDto.relatedAnimeIds) {
      anime.relatedAnimes = await Promise.all(
        updateAnimeDto.relatedAnimeIds.map((animeId) =>
          this.animeRepository.findOne({ where: { id: animeId } }),
        ),
      );
    }

    return await this.animeRepository.save(anime);
  }

  async remove(id: string): Promise<void> {
    const result = await this.animeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Anime with ID ${id} not found`);
    }
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
