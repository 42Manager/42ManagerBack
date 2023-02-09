import {
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
  ApiBearerAuth,
  ApiCookieAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Account } from './entities/auth.entity';
import { JwtRefreshTokenGuard } from './guard/jwt.auth.guard';
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

  @ApiOperation({ summary: '로그인' })
  @ApiOkResponse({ description: '로그인 성공' })
  @ApiUnauthorizedResponse({ description: '42OAuth, API 요청 실패' })
  @ApiBadRequestResponse({ description: '올바르지 않은 매개변수 삽입' })
  @ApiInternalServerErrorResponse({ description: 'DB 에러 발생' })
  @ApiCookieAuth()
  @Post('token')
  async login(
    @Cookies('ftAccessToken') ftAccessToken: string,
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
      domain: this.config.get('FRONT_DOMAIN'),
      httpOnly: true,
      // secure: true,
    });

    return {
      status: serviceResult.status,
      accessToken: serviceResult.accessToken,
    };
  }

  @ApiOperation({ summary: '토큰 재발급' })
  @ApiOkResponse({ description: '토큰 재발급 성공' })
  @ApiUnauthorizedResponse({ description: '토큰 인증 실패' })
  @ApiInternalServerErrorResponse({ description: 'DB 에러 발생' })
  @ApiCookieAuth()
  @Patch('token')
  @UseGuards(JwtRefreshTokenGuard)
  async reissuanceToken(
    @Cookies('refreshToken') account: Account,
    @Res({ passthrough: true }) res: Response,
  ) {
    const serviceResult = await this.authService.reissuanceToken(account.uid);

    res.cookie('refreshToken', serviceResult.refreshToken, {
      domain: this.config.get('FRONT_DOMAIN'),
      httpOnly: true,
      // secure: true,
    });

    return {
      status: serviceResult.status,
      accessToken: serviceResult.accessToken,
    };
  }
}
