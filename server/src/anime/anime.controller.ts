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

@ApiTags('애니메이션')
@Controller('anime')
export class AnimeController {
  constructor(private readonly animeService: AnimeService) {}

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

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '애니메이션 상세 조회' })
  @ApiResponse({ status: 200, description: '애니메이션 상세 조회 성공' })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청' })
  @ApiResponse({ status: 404, description: '애니메이션을 찾을 수 없음' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.animeService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '애니메이션 수정' })
  @ApiResponse({ status: 200, description: '애니메이션 수정 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청' })
  @ApiResponse({ status: 404, description: '애니메이션을 찾을 수 없음' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateAnimeDto: UpdateAnimeDto,
  ) {
    return this.animeService.update(id, updateAnimeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '애니메이션 삭제' })
  @ApiResponse({ status: 200, description: '애니메이션 삭제 성공' })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청' })
  @ApiResponse({ status: 404, description: '애니메이션을 찾을 수 없음' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.animeService.remove(id);
  }

  @Post(':id/related/:relatedId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '연관 애니메이션 추가' })
  @ApiResponse({ status: 200, description: '연관 애니메이션 추가 성공' })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청' })
  @ApiResponse({ status: 404, description: '애니메이션을 찾을 수 없음' })
  addRelatedAnime(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('relatedId', new ParseUUIDPipe()) relatedId: string,
  ) {
    return this.animeService.addRelatedAnime(id, relatedId);
  }
}
