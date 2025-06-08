import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EncodeVideoService } from './encode-video.service';

@Controller()
export class EncodeVideoController {
  constructor(private readonly encodeVideoService: EncodeVideoService) {}

  @MessagePattern('episode-uploaded')
  async handleEpisodeUploaded(@Payload() data: any) {
    return this.encodeVideoService.encodeVideo(data);
  }
}
