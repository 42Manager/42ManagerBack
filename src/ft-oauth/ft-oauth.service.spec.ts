import { Test, TestingModule } from '@nestjs/testing';
import { FtOauthService } from './ft-oauth.service';

describe('FtOauthService', () => {
  let service: FtOauthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FtOauthService],
    }).compile();

    service = module.get<FtOauthService>(FtOauthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
