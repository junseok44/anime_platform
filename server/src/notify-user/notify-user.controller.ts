import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotifyUserService } from './notify-user.service';

@Controller()
export class NotifyUserController {
  constructor(private readonly notifyUserService: NotifyUserService) {}

  @MessagePattern('episode-uploaded')
  async handleEpisodeUploaded(@Payload() data: any) {
    return this.notifyUserService.notifyUsers(data);
  }
}
