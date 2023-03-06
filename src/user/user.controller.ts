import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAccessTokenGuard } from 'src/auth/guard/jwt.auth.guard';
import { JwtPayload } from 'src/decorator/jwt-payload.decorator';
import { Account } from 'src/auth/entities/account.entity';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
@UseGuards(JwtAccessTokenGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '42 사용자 정보',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              ftAccessToken: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @ApiOkResponse({
    description: '성공',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            blackholedAt: {
              type: 'string',
              format: 'date-time',
              example: 'yyyy-MM-dd HH:mm:ss',
            },
            intraId: { type: 'string' },
            imageUrl: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: '42 카뎃이 아닌 사용자' })
  @ApiUnauthorizedResponse({ description: '토큰 만료' })
  @ApiInternalServerErrorResponse({ description: '서버 에러 발생' })
  @Get('42seoul')
  getMyPage42Info(
    @JwtPayload() account: Account,
    @Body('ftAccessToken') ftAccessToken: string,
  ) {
    console.log(`token : ${ftAccessToken}`);
    return this.userService.getMyPage42Info(account.uid, ftAccessToken);
  }
}
