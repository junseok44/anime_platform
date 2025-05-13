import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnimeEpisode } from './entities/anime-episode.entity';
import { CreateAnimeEpisodeDto } from './dto/create-anime-episode.dto';
import { UpdateAnimeEpisodeDto } from './dto/update-anime-episode.dto';
import { Anime } from '../anime/entities/anime.entity';
import * as fs from 'fs';
import * as path from 'path';

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
    video?: Express.Multer.File,
  ): Promise<AnimeEpisode> {
    const anime = await this.animeRepository.findOne({
      where: { id: createAnimeEpisodeDto.animeId },
    });

    if (!anime) {
      throw new NotFoundException('애니메이션을 찾을 수 없습니다.');
    }

    let videoPath: string | null = null;

    if (video) {
      // DB에는 상대 경로만 저장
      videoPath = `/videos/${video.filename}`;
    }

    const episode = this.animeEpisodeRepository.create({
      ...createAnimeEpisodeDto,
      anime,
      videoPath,
    });

    return this.animeEpisodeRepository.save(episode);
  }

  async findAll(): Promise<AnimeEpisode[]> {
    return await this.animeEpisodeRepository.find({
      relations: ['anime'],
    });
  }

  async findOne(id: string): Promise<AnimeEpisode> {
    const episode = await this.animeEpisodeRepository.findOne({
      where: { id },
      relations: ['anime'],
    });

    if (!episode) {
      throw new NotFoundException('에피소드를 찾을 수 없습니다.');
    }

    return episode;
  }

  async update(
    id: string,
    updateAnimeEpisodeDto: UpdateAnimeEpisodeDto,
  ): Promise<AnimeEpisode> {
    const episode = await this.findOne(id);

    Object.assign(episode, updateAnimeEpisodeDto);
    return this.animeEpisodeRepository.save(episode);
  }

  async remove(id: string): Promise<void> {
    const episode = await this.findOne(id);

    // 비디오 파일이 있다면 삭제
    if (episode.videoPath) {
      const fileName = path.basename(episode.videoPath);
      const filePath = path.join(process.cwd(), 'files', 'videos', fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await this.animeEpisodeRepository.remove(episode);
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
    return this.animeEpisodeRepository.save(episode);
  }

  async getVideoStream(id: string) {
    const episode = await this.findOne(id);

    if (!episode.videoPath) {
      throw new NotFoundException('비디오 파일을 찾을 수 없습니다.');
    }

    const fileName = path.basename(episode.videoPath);
    const filePath = path.join(process.cwd(), 'files', 'videos', fileName);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('비디오 파일을 찾을 수 없습니다.');
    }

    return fs.createReadStream(filePath);
  }
}
