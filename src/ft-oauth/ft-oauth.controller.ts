import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Patch,
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
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Cookies } from 'src/decorator/cookie-jwt.decorator';

@ApiTags('42OAuth')
@Controller('42oauth')
export class FtOauthController {
  constructor(
    private readonly ftOauthService: FtOauthService,
    private readonly config: ConfigService,
  ) {}

  @ApiOperation({
    summary: '42 code 발급',
    description:
      '42 인트라 로그인 창으로 리다이렉션<br>로그인 성공 시 발급된 code를 가지고 /42oauth/token uri의 API로 리다이렉션',
  })
  @ApiResponse({ status: 302, description: '리다이렉션 성공' })
  @ApiInternalServerErrorResponse({ description: 'code 발급 실패' })
  @Get('authorize')
  async issue42code(@Res({ passthrough: true }) res: Response) {
    try {
      res.redirect(
        `https://api.intra.42.fr/oauth/authorize?client_id=${this.config.get(
          'FT_API_UID',
        )}&redirect_uri=${this.config.get(
          'FT_REDIRECT_URI',
        )}&response_type=${this.config.get('FT_RESPONSE_TYPE')}`,
      );
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({
    summary: '42 token 발급',
    description:
      '인트라 로그인 창에서 자동으로 리다이렉션 되어 호출되는 API<br>access token은 body, refresh token은 cookie에 발급',
  })
  @ApiOkResponse({
    description: '42 token 발급 성공',
    schema: {
      type: 'object',
      properties: {
        ftAccessToken: { type: 'string' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: '42 token 발급 실패' })
  @Post('token')
  async issue42token(
    @Query('code') code: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const serviceResult = await this.ftOauthService.issue42token(code);

    res.cookie('ftRefreshToken', serviceResult.ftRefreshToken, {
      domain: process.env.FRONT_DOMAIN,
      httpOnly: true,
      secure: true,
    });

    return {
      ftAccessToken: serviceResult.ftAccessToken,
    };
  }

  @ApiOperation({
    summary: '42 token 재발급',
    description:
      'cookie에 있는 42 refresh token으로 재발급<br>access token은 body, refresh token은 cookie에 발급',
  })
  @ApiOkResponse({
    description: '42 token 재발급 성공',
    schema: {
      type: 'object',
      properties: {
        ftAccessToken: { type: 'string' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: '42 token 재발급 실패' })
  @Patch('token')
  async reissue42token(
    @Cookies('ftRefreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const serviceResult = await this.ftOauthService.reisse42token(refreshToken);

    res.cookie('ftRefreshToken', serviceResult.ftRefreshToken, {
      domain: process.env.FRONT_DOMAIN,
      httpOnly: true,
      secure: true,
    });

    return {
      ftAccessToken: serviceResult.ftAccessToken,
    };
  }
}
