import { Injectable } from '@nestjs/common';

@Injectable()
export class EncodeVideoService {
  async encodeVideo(data: {
    episodeId: string;
    videoPath: string;
    animeId: string;
    userId: string;
    episodeNumber: number;
    title: string;
  }) {
    console.log('인코딩 모듈에서 비디오 인코딩 시작:', data);
    // TODO: 실제 비디오 인코딩 로직 구현
    return { success: true };
  }
}
