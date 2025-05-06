import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendVerificationEmail(email: string, code: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: '이메일 인증',
      template: 'email-verification',
      context: {
        code,
      },
    });
  }
}
