import { Module } from '@nestjs/common';
import { FtOauthService } from './ft-oauth.service';
import { FtOauthController } from './ft-oauth.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [FtOauthController],
  providers: [FtOauthService],
})
export class FtOauthModule {}
