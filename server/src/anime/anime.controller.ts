import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AnimeService } from './anime.service';
import { CreateAnimeDto } from './dto/create-anime.dto';
import { UpdateAnimeDto } from './dto/update-anime.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RateLimit } from 'src/common/guards/rate-limit.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';

@ApiTags('애니메이션')
@Controller('anime')
export class AnimeController {
  constructor(private readonly animeService: AnimeService) {}

  @Get('likes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '좋아요한 애니메이션 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '좋아요한 애니메이션 목록 조회 성공',
  })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청' })
  getLikedAnimes(@CurrentUser() user: JwtPayload) {
    return this.animeService.getLikedAnimes(user.sub);
  }

  @Get('likes/:animeId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '애니메이션 좋아요 여부 확인' })
  @ApiResponse({ status: 200, description: '좋아요 여부 확인 성공' })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청' })
  @ApiResponse({ status: 404, description: '애니메이션을 찾을 수 없음' })
  isLiked(
    @Param('animeId', new ParseUUIDPipe()) animeId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.animeService.isLiked(animeId, user.sub);
  }

  @Post('likes/:animeId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '애니메이션 좋아요 토글' })
  @ApiResponse({ status: 200, description: '좋아요 토글 성공' })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청' })
  @ApiResponse({ status: 404, description: '애니메이션을 찾을 수 없음' })
  toggleLike(
    @Param('animeId', new ParseUUIDPipe()) animeId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.animeService.toggleLike(animeId, user.sub);
  }

  @Post(':animeId/related/:relatedAnimeId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '연관 애니메이션 추가' })
  @ApiResponse({ status: 200, description: '연관 애니메이션 추가 성공' })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청' })
  @ApiResponse({ status: 404, description: '애니메이션을 찾을 수 없음' })
  addRelatedAnime(
    @Param('animeId', new ParseUUIDPipe()) animeId: string,
    @Param('relatedAnimeId', new ParseUUIDPipe()) relatedAnimeId: string,
  ) {
    return this.animeService.addRelatedAnime(animeId, relatedAnimeId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '애니메이션 생성' })
  @ApiResponse({ status: 201, description: '애니메이션 생성 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청' })
  create(@Body() createAnimeDto: CreateAnimeDto) {
    return this.animeService.create(createAnimeDto);
  }

  @Get()
  @ApiOperation({ summary: '모든 애니메이션 조회' })
  @ApiResponse({ status: 200, description: '애니메이션 목록 조회 성공' })
  @RateLimit({ limit: 5, window: 5 })
  findAll() {
    return this.animeService.findAll();
  }

  @Get(':animeId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '애니메이션 상세 조회' })
  @ApiResponse({ status: 200, description: '애니메이션 상세 조회 성공' })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청' })
  @ApiResponse({ status: 404, description: '애니메이션을 찾을 수 없음' })
  findOne(@Param('animeId', new ParseUUIDPipe()) animeId: string) {
    return this.animeService.findOne(animeId);
  }

  @Patch(':animeId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '애니메이션 수정' })
  @ApiResponse({ status: 200, description: '애니메이션 수정 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청' })
  @ApiResponse({ status: 404, description: '애니메이션을 찾을 수 없음' })
  update(
    @Param('animeId', new ParseUUIDPipe()) animeId: string,
    @Body() updateAnimeDto: UpdateAnimeDto,
  ) {
    return this.animeService.update(animeId, updateAnimeDto);
  }

  @Delete(':animeId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '애니메이션 삭제' })
  @ApiResponse({ status: 200, description: '애니메이션 삭제 성공' })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청' })
  @ApiResponse({ status: 404, description: '애니메이션을 찾을 수 없음' })
  remove(@Param('animeId', new ParseUUIDPipe()) animeId: string) {
    return this.animeService.remove(animeId);
  }
}
