import { Test, TestingModule } from '@nestjs/testing';
import { FtOauthController } from './ft-oauth.controller';
import { FtOauthService } from './ft-oauth.service';

describe('FtOauthController', () => {
  let controller: FtOauthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FtOauthController],
      providers: [FtOauthService],
    }).compile();

    controller = module.get<FtOauthController>(FtOauthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
