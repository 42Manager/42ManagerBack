import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetAccount } from './decorator/account-info.decorator';
import { Account } from './entities/auth.entity';
import { JwtRefreshTokenGuard } from './guard/jwt.auth.guard';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'refresh token을 이용한 자동 로그인' })
  @ApiOkResponse({ description: '자동 로그인 성공' })
  @ApiUnauthorizedResponse({ description: '토큰 인증 실패' })
  @ApiInternalServerErrorResponse({ description: 'DB 에러 발생' })
  @ApiBearerAuth()
  @Post('')
  @UseGuards(JwtRefreshTokenGuard)
  async automaticLogin(@GetAccount() account: Account) {
    return await this.authService.automaticLogin(account.uid);
  }

  @ApiOperation({ summary: '로그인' })
  @ApiOkResponse({ description: '로그인 성공' })
  @ApiUnauthorizedResponse({ description: '42OAuth, API 요청 실패' })
  @ApiBadRequestResponse({ description: '올바르지 않은 매개변수 삽입' })
  @ApiInternalServerErrorResponse({ description: 'DB 에러 발생' })
  @Post('token')
  async login(@Body() loginDto: LoginDto) {
    if (loginDto.code === null) {
      throw new HttpException('code not found', HttpStatus.BAD_REQUEST);
    }

    return await this.authService.login(loginDto.code);
  }
}
