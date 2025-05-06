import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => {
        const isDev = config.get('NODE_ENV') === 'development';
        const templateDir = isDev
          ? join(__dirname, 'templates')
          : join(process.cwd(), 'dist/email/templates');

        return {
          transport: {
            host: config.get('SMTP_HOST'),
            port: config.get('SMTP_PORT'),
            secure: true,
            auth: {
              user: config.get('SMTP_USER'),
              pass: config.get('SMTP_PASS'),
            },
          },
          defaults: {
            from: config.get('SMTP_FROM'),
          },
          template: {
            dir: templateDir,
            adapter: new HandlebarsAdapter(undefined, {
              inlineCssEnabled: false,
            }),
            options: {
              strict: true,
              inlineCss: false,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
