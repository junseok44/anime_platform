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
import { AnimeRating } from 'src/ratings/entities/anime-rating.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(AnimeRating)
    private readonly animeRatingRepository: Repository<AnimeRating>,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    user: User,
  ): Promise<Comment> {
    const comment = new Comment();
    comment.content = createCommentDto.content;
    comment.type = createCommentDto.type;
    comment.author = user;

    if (createCommentDto.type === CommentType.REVIEW) {
      if (!createCommentDto.animeId) {
        throw new BadRequestException('Anime ID is required for reviews');
      }
      comment.anime = { id: createCommentDto.animeId } as any;
    }

    if (createCommentDto.type === CommentType.EPISODE_COMMENT) {
      if (!createCommentDto.episodeId) {
        throw new BadRequestException(
          'Episode ID is required for episode comments',
        );
      }
      comment.episode = { id: createCommentDto.episodeId } as any;
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

    if (comment.author.id !== user.id) {
      throw new BadRequestException('Only the author can update this comment');
    }

    if (updateCommentDto.content) {
      comment.content = updateCommentDto.content;
    }

    return await this.commentRepository.save(comment);
  }

  async remove(id: string, user: User): Promise<void> {
    const comment = await this.findOne(id);

    if (comment.author.id !== user.id) {
      throw new BadRequestException('Only the author can delete this comment');
    }

    comment.isDeleted = true;
    await this.commentRepository.save(comment);
  }

  async findByAnimeId(
    animeId: string,
  ): Promise<(Comment & { rating?: number })[]> {
    const [comments, ratings] = await Promise.all([
      this.commentRepository.find({
        where: {
          anime: { id: animeId },
          type: CommentType.REVIEW,
          isDeleted: false,
        },
        relations: ['author'],
        order: {
          createdAt: 'DESC',
        },
      }),
      this.animeRatingRepository.find({
        where: { anime: { id: animeId } },
        relations: ['user'],
      }),
    ]);

    const ratingMap = new Map(
      ratings.map((rating) => [rating.user.id, rating.rating]),
    );

    return comments.map((comment) => ({
      ...comment,
      rating: ratingMap.get(comment.author.id),
    }));
  }

  async findByEpisodeId(episodeId: string): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: {
        episode: { id: episodeId },
        type: CommentType.EPISODE_COMMENT,
        isDeleted: false,
      },
      relations: ['author'],
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
