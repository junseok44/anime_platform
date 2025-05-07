import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment, CommentType } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from '../users/entities/user.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AnimeRating } from '../anime/entities/anime-rating.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(AnimeRating)
    private animeRatingRepository: Repository<AnimeRating>,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    user: User,
  ): Promise<Comment> {
    const comment = this.commentRepository.create({
      ...createCommentDto,
      author: user,
    });

    // 타입에 따라 animeId 또는 episodeId가 필수
    if (
      createCommentDto.type === CommentType.REVIEW &&
      !createCommentDto.animeId
    ) {
      throw new BadRequestException('Anime ID is required for reviews');
    }
    if (
      createCommentDto.type === CommentType.EPISODE_COMMENT &&
      !createCommentDto.episodeId
    ) {
      throw new BadRequestException(
        'Episode ID is required for episode comments',
      );
    }

    return await this.commentRepository.save(comment);
  }

  async findAll(): Promise<Comment[]> {
    return await this.commentRepository.find({
      relations: ['author', 'anime', 'episode'],
    });
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'anime', 'episode'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return comment;
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
    user: User,
  ): Promise<Comment> {
    const comment = await this.findOne(id);

    // 작성자만 수정 가능
    if (comment.author.id !== user.id) {
      throw new BadRequestException('Only the author can update this comment');
    }

    Object.assign(comment, updateCommentDto);
    return await this.commentRepository.save(comment);
  }

  async remove(id: string, user: User): Promise<void> {
    const comment = await this.findOne(id);

    // 작성자만 삭제 가능
    if (comment.author.id !== user.id) {
      throw new BadRequestException('Only the author can delete this comment');
    }

    // 실제 삭제 대신 isDeleted 플래그 설정
    comment.isDeleted = true;
    await this.commentRepository.save(comment);
  }

  async findByAnimeId(
    animeId: string,
  ): Promise<(Comment & { rating?: number })[]> {
    const comments = await this.commentRepository.find({
      where: { anime: { id: animeId }, type: CommentType.REVIEW },
      relations: ['author'],
    });

    // 각 댓글 작성자의 평점 정보 조회
    const commentsWithRatings = await Promise.all(
      comments.map(async (comment) => {
        const rating = await this.animeRatingRepository.findOne({
          where: {
            anime: { id: animeId },
            user: { id: comment.author.id },
          },
        });

        return {
          ...comment,
          rating: rating?.rating,
        };
      }),
    );

    return commentsWithRatings;
  }

  async findByEpisodeId(episodeId: string): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: { episode: { id: episodeId }, type: CommentType.EPISODE_COMMENT },
      relations: ['author'],
    });
  }

  async toggleLike(id: string): Promise<Comment> {
    const comment = await this.findOne(id);
    // TODO: 사용자별 좋아요 상태 관리 로직 추가
    comment.likes += 1;
    return await this.commentRepository.save(comment);
  }
}
