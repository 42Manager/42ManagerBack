import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { FtOauthService } from './ft-oauth.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('42OAuth')
@Controller('42oauth')
export class FtOauthController {
  constructor(
    private readonly ftOauthService: FtOauthService,
    private readonly config: ConfigService,
  ) {}

  @ApiOperation({ summary: '42 code 발급 (리다이렉션)' })
  @ApiInternalServerErrorResponse({ description: 'code 발급 실패' })
  @Get('authorize')
  async get42code(@Res({ passthrough: true }) res: Response) {
    try {
      res.redirect(
        `https://api.intra.42.fr/oauth/authorize?client_id=${this.config.get(
          'FT_API_UID',
        )}&redirect_uri=${this.config.get(
          'FT_REDIRECT_URI',
        )}&response_type=${this.config.get('FT_RESPONSE_TYPE')}`,
      );
    } catch (err) {
      return new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: '42 access token 발급' })
  @ApiOkResponse({ description: '42 access token 발급 성공' })
  @ApiUnauthorizedResponse({ description: '42 access token 발급 실패' })
  @Post('token')
  async get42token(
    @Query('code') code: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const serviceResult = await this.ftOauthService.get42token(code);

    res.cookie('ftAccessToken', serviceResult.ftAccessToken, {
      domain: process.env.FRONT_DOMAIN,
      httpOnly: true,
      // secure: true,
    });

    return serviceResult.status;
  }
}
