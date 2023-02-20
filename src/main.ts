import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Account } from './auth/entities/account.entity';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
dotenv.config({ path: '../.env' });

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync(process.env.SSL_KEY_LOCATION),
    cert: fs.readFileSync(process.env.SSL_CERT_LOCATION),
  };
  const app = await NestFactory.create(AppModule, { httpsOptions });

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

  app.use(cookieParser());
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
