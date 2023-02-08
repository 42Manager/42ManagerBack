import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Account } from './entities/auth.entity';
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

  async login(code: string) {
    let intraAccessToken;
    let intraInfo;
    let uid;

    try {
      const accessTokenResult = await this.httpService.axiosRef.post(
        'https://api.intra.42.fr/oauth/token',
        JSON.stringify({
          grant_type: 'authorization_code',
          client_id: this.config.get('FT_API_UID'),
          client_secret: this.config.get('FT_API_SECRET'),
          code,
          redirect_uri: 'https://42seoul.link',
        }),
        {
          headers: {
            'content-type': 'application/json',
          },
        },
      );

      intraAccessToken = accessTokenResult.data.access_token;
      console.log(intraAccessToken);
    } catch (err) {
      console.log('42 access token 발급 실패');
      throw new HttpException(err, HttpStatus.UNAUTHORIZED);
    }

    try {
      const intraInfoResult = await this.httpService.axiosRef.get(
        'https://api.intra.42.fr/v2/me',
        {
          headers: {
            Authorization: `Bearer ${intraAccessToken}`,
            'content-type': 'application/json',
          },
        },
      );

      intraInfo = {
        id: intraInfoResult.data.id,
        intraId: intraInfoResult.data.login,
        photoUrl: intraInfoResult.data.image.link,
      };
    } catch (err) {
      console.log('42 사용자 정보 확인 실패');
      throw new HttpException(err, HttpStatus.UNAUTHORIZED);
    }

    try {
      const user: Account = await await this.accountRepository.findOne({
        where: { intra_id: intraInfo.intraId },
      });

      if (user === null) {
        const insertedData = await this.accountRepository.save({
          intra_id: intraInfo.intraId,
        });
        uid = insertedData.uid;
      } else {
        uid = user.uid;
      }
    } catch (err) {
      console.log('사용자 정보 확인 실패');
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const accessToken = this.jwtService.sign({
      uid: uid,
      intraId: intraInfo.intraId,
    });

    const refreshToken = this.jwtService.sign({
      uid: uid,
    });
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
      intraAccessToken: intraAccessToken,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async automaticLogin(uid: string) {
    let account: Account;
    try {
      account = await this.accountRepository.findOne({
        where: { uid },
      });
    } catch (err) {
      console.log('사용자 정보 확인 실패');
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const accessToken = this.jwtService.sign({
      uid: account.uid,
      intraId: account.intra_id,
    });

    const refreshToken = this.jwtService.sign({
      uid: account.uid,
    });
    try {
      await this.accountRepository.save({
        uid,
        intra_id: account.intra_id,
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
    };
  }
}
