import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AnimeEpisodeService } from './anime-episode.service';
import { CreateAnimeEpisodeDto } from './dto/create-anime-episode.dto';
import { UpdateAnimeEpisodeDto } from './dto/update-anime-episode.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';

@ApiTags('애니메이션 에피소드')
@Controller('anime-episodes')
@ApiBearerAuth('access-token')
export class AnimeEpisodeController {
  constructor(private readonly animeEpisodeService: AnimeEpisodeService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '에피소드 생성' })
  @ApiResponse({ status: 201, description: '에피소드 생성 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('video'))
  create(
    @Body() createAnimeEpisodeDto: CreateAnimeEpisodeDto,
    @UploadedFile() video?: Express.Multer.File,
  ) {
    return this.animeEpisodeService.create(createAnimeEpisodeDto, video);
  }

  @Get(':id')
  @ApiOperation({ summary: '에피소드 상세 조회' })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: '에피소드 상세 조회 성공' })
  @ApiResponse({ status: 404, description: '에피소드를 찾을 수 없음' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.animeEpisodeService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '에피소드 수정' })
  @ApiResponse({ status: 200, description: '에피소드 수정 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청' })
  @ApiResponse({ status: 404, description: '에피소드를 찾을 수 없음' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateAnimeEpisodeDto: UpdateAnimeEpisodeDto,
  ) {
    return this.animeEpisodeService.update(id, updateAnimeEpisodeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '에피소드 삭제' })
  @ApiResponse({ status: 200, description: '에피소드 삭제 성공' })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청' })
  @ApiResponse({ status: 404, description: '에피소드를 찾을 수 없음' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.animeEpisodeService.remove(id);
  }

  @Get('anime/:animeId')
  @ApiOperation({ summary: '애니메이션별 에피소드 조회' })
  @ApiResponse({ status: 200, description: '에피소드 목록 조회 성공' })
  @ApiResponse({ status: 404, description: '애니메이션을 찾을 수 없음' })
  findByAnimeId(@Param('animeId', new ParseUUIDPipe()) animeId: string) {
    return this.animeEpisodeService.findByAnimeId(animeId);
  }

  @Patch(':id/expiration')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '에피소드 만료 상태 업데이트' })
  @ApiResponse({ status: 200, description: '만료 상태 업데이트 성공' })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청' })
  @ApiResponse({ status: 404, description: '에피소드를 찾을 수 없음' })
  updateExpirationStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('isExpired') isExpired: boolean,
  ) {
    return this.animeEpisodeService.updateExpirationStatus(id, isExpired);
  }
}
