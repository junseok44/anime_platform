import { Injectable } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KafkaService {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'anime-service',
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'anime-service-group',
      },
    },
  })
  private client: ClientKafka;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    await this.client.connect();
  }

  async publishEpisodeUploaded(data: {
    episodeId: string;
    videoPath: string;
    animeId: string;
    userId: string;
    episodeNumber: number;
    title: string;
  }) {
    return this.client.emit('episode-uploaded', data);
  }
}
