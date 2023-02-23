import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { formatInTimeZone } from 'date-fns-tz';
import { Account } from 'src/auth/entities/account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly httpService: HttpService,
  ) {}

  async getMyPage42Info(uid: string, ftAccessToken: string) {
    const data = {};

    try {
      const intraInfoResult = await this.httpService.axiosRef.get(
        'https://api.intra.42.fr/v2/me',
        {
          headers: {
            Authorization: `Bearer ${ftAccessToken}`,
            'content-type': 'application/json',
          },
        },
      );
      const filterResult = intraInfoResult.data.cursus_users.filter(
        (item) => item.cursus_id === 21,
      );

      if (filterResult.length !== 1) {
        throw new BadRequestException('42 카뎃이 아닌 사용자');
      }

      const blackholedAt = filterResult[0].blackholed_at;
      if (blackholedAt === undefined) {
        throw new InternalServerErrorException('블랙홀 정보를 받아오지 못함');
      }

      data['blackholedAt'] = formatInTimeZone(
        blackholedAt,
        'Asia/Seoul',
        'yyyy-MM-dd HH:mm:ss',
      );
    } catch (err) {
      throw new UnauthorizedException(err);
    }

    try {
      const account: Account = await this.accountRepository.findOne({
        where: { uid },
      });
      data['intraId'] = account.intraId;
      data['imageUrl'] = account.imageUrl;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }

    return { data };
  }
}
