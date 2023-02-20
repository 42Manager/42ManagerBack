import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Account } from './auth/entities/account.entity';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { LoggingInterceptor } from './interceptor/logger.interceptor';
import * as http from 'http';
import * as https from 'https';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

dotenv.config({ path: '../.env' });

async function bootstrap() {
  const server = express();
  const httpsOptions = {
    key: fs.readFileSync(process.env.SSL_KEY_LOCATION),
    cert: fs.readFileSync(process.env.SSL_CERT_LOCATION),
  };
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

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
  app.use(cookieParser());
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  await app.init();

  http.createServer(server).listen(3000);
  https.createServer(httpsOptions, server).listen(443);
}
bootstrap();
