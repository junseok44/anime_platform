import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnimeEpisode } from 'src/anime-episode/entities/anime-episode.entity';
import { Repository } from 'typeorm';
import { CreateAnimeDto } from './dto/create-anime.dto';
import { UpdateAnimeDto } from './dto/update-anime.dto';
import { Anime } from './entities/anime.entity';
import { Category } from './entities/category.entity';
import { User } from '../users/entities/user.entity';

type EpisodeWithAnimeId = AnimeEpisode & { animeId: string };

@Injectable()
export class AnimeService {
  constructor(
    @InjectRepository(Anime)
    private readonly animeRepository: Repository<Anime>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
      relations: ['episodes', 'relatedAnimes'],
    });
  }

  async findOne(id: string): Promise<Anime> {
    const anime = await this.animeRepository.findOne({
      where: { id },
      relations: ['episodes', 'relatedAnimes'],
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

  async findEpisodes(animeId: string): Promise<AnimeEpisode[]> {
    const anime = await this.animeRepository.findOne({
      where: { id: animeId },
      relations: ['episodes'],
    });

    if (!anime) {
      throw new NotFoundException(`Anime with ID ${animeId} not found`);
    }

    return anime.episodes;
  }

  async findEpisodesByAnimeIds(
    animeIds: string[],
  ): Promise<EpisodeWithAnimeId[]> {
    return this.animeRepository
      .createQueryBuilder('anime')
      .leftJoinAndSelect('anime.episodes', 'episodes')
      .where('anime.id IN (:...ids)', { ids: animeIds })
      .getMany()
      .then((animes) => {
        return animes.flatMap((anime) =>
          anime.episodes.map((episode) => ({ ...episode, animeId: anime.id })),
        );
      });
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

  async toggleLike(animeId: string, userId: string): Promise<boolean> {
    const anime = await this.animeRepository.findOne({
      where: { id: animeId },
      relations: ['likedBy'],
    });

    if (!anime) {
      throw new NotFoundException('애니메이션을 찾을 수 없습니다.');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['likedAnimes'],
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const isLiked = anime.likedBy.some((likedUser) => likedUser.id === userId);

    if (isLiked) {
      anime.likedBy = anime.likedBy.filter(
        (likedUser) => likedUser.id !== userId,
      );
      user.likedAnimes = user.likedAnimes.filter(
        (likedAnime) => likedAnime.id !== animeId,
      );
    } else {
      anime.likedBy.push(user);
      user.likedAnimes.push(anime);
    }

    await this.animeRepository.save(anime);
    await this.userRepository.save(user);

    return !isLiked;
  }

  async isLiked(animeId: string, userId: string): Promise<boolean> {
    const anime = await this.animeRepository.findOne({
      where: { id: animeId },
      relations: ['likedBy'],
    });

    if (!anime) {
      throw new NotFoundException('애니메이션을 찾을 수 없습니다.');
    }

    return anime.likedBy.some((user) => user.id === userId);
  }

  async getLikedAnimes(userId: string): Promise<Anime[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['likedAnimes'],
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return user.likedAnimes;
  }
}
