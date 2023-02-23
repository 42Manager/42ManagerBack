import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAccessTokenGuard } from 'src/auth/guard/jwt.auth.guard';
import { JwtPayload } from 'src/decorator/jwt-payload.decorator';
import { Account } from 'src/auth/entities/account.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
@UseGuards(JwtAccessTokenGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '42 사용자 정보' })
  @Get('42seoul')
  getMyPage42Info(
    @JwtPayload() account: Account,
    @Body('ftAccessToken') ftAccessToken: string,
  ) {
    return this.userService.getMyPage42Info(account.uid, ftAccessToken);
  }
}
