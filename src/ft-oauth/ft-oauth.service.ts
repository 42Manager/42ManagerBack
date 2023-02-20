import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FtOauthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {}

  async issue42token(code: string) {
    let ftAccessToken;
    let ftRefreshToken;

    try {
      const tokenResult = await this.httpService.axiosRef.post(
        'https://api.intra.42.fr/oauth/token',
        JSON.stringify({
          grant_type: 'authorization_code',
          client_id: this.config.get('FT_API_UID'),
          client_secret: this.config.get('FT_API_SECRET'),
          code,
          redirect_uri: this.config.get('FT_REDIRECT_URI'),
        }),
        {
          headers: {
            'content-type': 'application/json',
          },
        },
      );

      ftAccessToken = tokenResult.data.access_token;
      ftRefreshToken = tokenResult.data.refresh_token;
    } catch (err) {
      console.log('42 token 발급 실패');
      throw new HttpException(err, HttpStatus.UNAUTHORIZED);
    }

    return {
      ftAccessToken,
      ftRefreshToken,
    };
  }

  async reisse42token(refreshToken: string) {
    let ftAccessToken;
    let ftRefreshToken;

    try {
      const tokenResult = await this.httpService.axiosRef.post(
        'https://api.intra.42.fr/oauth/token',
        JSON.stringify({
          grant_type: 'refresh_token',
          client_id: this.config.get('FT_API_UID'),
          client_secret: this.config.get('FT_API_SECRET'),
          refresh_token: refreshToken,
        }),
        {
          headers: {
            'content-type': 'application/json',
          },
        },
      );

      ftAccessToken = tokenResult.data.access_token;
      ftRefreshToken = tokenResult.data.refresh_token;
    } catch (err) {
      console.log('42 token 재발급 실패');
      throw new HttpException(err, HttpStatus.UNAUTHORIZED);
    }

    return {
      ftAccessToken,
      ftRefreshToken,
    };
  }
}
