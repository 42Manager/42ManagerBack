import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async reissuanceToken(uid: string) {
    let account: Account;
    try {
      account = await this.accountRepository.findOne({
        where: { uid },
      });
    } catch (err) {
      console.log('사용자 정보 확인 실패');
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const accessToken = this.jwtService.sign(
      {
        uid: account.uid,
        intraId: account.intraId,
      },
      {
        expiresIn: this.config.get('JWT_ACCESS_EXPIRE'),
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        uid: account.uid,
      },
      {
        expiresIn: this.config.get('JWT_REFRESH_EXPIRE'),
      },
    );

    try {
      await this.accountRepository.update(
        { uid: account.uid },
        { refreshToken },
      );
    } catch (err) {
      console.log('refresh token 삽입 에러');
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return {
      status: true,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async login(ftAccessToken: string) {
    let intraInfo;
    let uid;

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

      intraInfo = {
        intraId: intraInfoResult.data.login,
        imageUrl: intraInfoResult.data.image.link,
      };
    } catch (err) {
      console.log('42 사용자 정보 확인 실패');
      throw new HttpException(err, HttpStatus.UNAUTHORIZED);
    }

    try {
      const user: Account = await await this.accountRepository.findOne({
        where: { intraId: intraInfo.intraId },
      });

      if (user === null) {
        const insertedData = await this.accountRepository.save({
          intraId: intraInfo.intraId,
          imageUrl: intraInfo.imageUrl,
        });
        uid = insertedData.uid;
      } else {
        uid = user.uid;
      }
    } catch (err) {
      console.log('사용자 정보 저장 실패');
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const accessToken = this.jwtService.sign(
      {
        uid,
        intraId: intraInfo.intraId,
      },
      {
        expiresIn: this.config.get('JWT_ACCESS_EXPIRE'),
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        uid,
      },
      {
        expiresIn: this.config.get('JWT_REFRESH_EXPIRE'),
      },
    );

    try {
      await this.accountRepository.save({
        uid,
        refresh_token: refreshToken,
      });
    } catch (err) {
      console.log('refresh token 삽입 에러');
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return {
      status: true,
      accessToken: accessToken,
      refreshToken: refreshToken,
      ftAccessToken: ftAccessToken,
      imageUrl: intraInfo.imageUrl,
    };
  }
}
