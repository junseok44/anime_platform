import { Injectable } from '@nestjs/common';

@Injectable()
export class NotifyUserService {
  async notifyUsers(data: {
    episodeId: string;
    videoPath: string;
    animeId: string;
    userId: string;
    episodeNumber: number;
    title: string;
  }) {
    console.log('사용자 알림 전송:', data);
    // TODO: 실제 알림 전송 로직 구현
    return { success: true };
  }
}
