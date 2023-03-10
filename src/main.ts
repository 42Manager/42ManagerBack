import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Account } from './auth/entities/account.entity';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { LoggingInterceptor } from './logger/logger.loggingInterceptor';
import { LoggingExceptionfilter } from './logger/logger.loggingExceptonfilter';
//import { LoggingInterceptor } from './interceptor/logger.interceptor';
dotenv.config({ path: '../.env' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('42Manager')
    .setDescription('42Manager API')
    .setVersion('0.1')
    .addBearerAuth({
      type: 'http',
      description: 'access token',
    })
    .addCookieAuth('token', {
      type: 'http',
      in: 'Header',
      scheme: 'Bearer',
      description: 'refresh token 또는 42 access token',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [Account],
  });
  SwaggerModule.setup('doc', app, document);

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new LoggingExceptionfilter());
  app.use(cookieParser());
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
