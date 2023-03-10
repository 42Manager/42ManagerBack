import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtRefreshTokenGuard } from './guard/jwt.auth.guard';
import { Account } from './entities/account.entity';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Cookies } from '../decorator/cookie-jwt.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @ApiOperation({
    summary: '42서울 사용자 로그인 및 token 발급',
    description: '42서울 사용자 확인을 위해 42 토큰 필요',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: { ftAccessToken: { type: 'string' } },
          },
        },
      },
    },
  })
  @ApiOkResponse({
    description: '로그인 성공',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        imageUrl: { type: 'string' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: '42OAuth, API 요청 실패' })
  @ApiBadRequestResponse({ description: '올바르지 않은 요청 데이터' })
  @ApiInternalServerErrorResponse({ description: '서버 에러 발생' })
  @Post('token/42seoul')
  async login(
    @Body('ftAccessToken') ftAccessToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (ftAccessToken === null) {
      throw new HttpException(
        '42 access token not found',
        HttpStatus.BAD_REQUEST,
      );
    }

    const serviceResult = await this.authService.login(ftAccessToken);

    res.cookie('refreshToken', serviceResult.refreshToken, {
      domain: null,
      httpOnly: true,
      secure: true,
    });

    return {
      accessToken: serviceResult.accessToken,
      imageUrl: serviceResult.imageUrl,
    };
  }

  @ApiOperation({
    summary: '토큰 재발급',
    description: 'cookie에 담겨있는 refresh token을 통해 token 재발급',
  })
  @ApiOkResponse({
    description: '토큰 재발급 성공',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: '토큰 인증 실패' })
  @ApiInternalServerErrorResponse({ description: '서버 에러 발생' })
  @ApiCookieAuth()
  @Patch('token')
  @UseGuards(JwtRefreshTokenGuard)
  async reissuanceToken(
    @Cookies('refreshToken') account: Account,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log(account);
    const serviceResult = await this.authService.reissuanceToken(account.uid);

    res.cookie('refreshToken', serviceResult.refreshToken, {
      domain: null,
      httpOnly: true,
      secure: true,
    });

    return {
      accessToken: serviceResult.accessToken,
    };
  }
}
