import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TodoModule } from './todo/todo.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FtOauthModule } from './ft-oauth/ft-oauth.module';

@Module({
  imports: [
    AuthModule,
    TodoModule,
    FtOauthModule,
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.api'],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        synchronize: false,
        entities: [__dirname + '/**/*.entity.{js,ts}'],
      }),
    }),
  ],
})
export class AppModule {}
