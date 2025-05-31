import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as path from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Laftel Clone API')
    .setDescription('Laftel Clone API 문서')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      syntaxHighlight: {
        activate: true,
        theme: 'monokai',
      },
    },
  });

  // 개발 환경에서만 GraphiQL HTML 및 정적 파일 서빙
  if (['local', 'dev', 'development'].includes(process.env.NODE_ENV)) {
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.use(
      '/graphiql',
      express.static(path.join(__dirname, '../graphiql')),
    );
    expressApp.get('/graphql', (req, res) => {
      res.sendFile(path.join(__dirname, '../graphiql/index.html'));
    });
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 속성은 제거
      forbidNonWhitelisted: true, // DTO에 정의되지 않은 속성이 있으면 요청 자체를 막음
      transform: true, // 요청 데이터를 DTO 클래스의 인스턴스로 변환
      transformOptions: {
        enableImplicitConversion: true, // 암시적 변환 활성화
      },
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
