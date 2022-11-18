import { Test } from '@nestjs/testing';
import { AppService } from './app.service';
describe('UserService', () => {
  let appService: AppService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AppService],
    }).compile();
    appService = module.get<AppService>(AppService);
  });

  it('Should be defined', () => {
    expect(appService).toBeDefined();
  });
  it('Should return that it said Hello', async () => {
    expect(appService.getHello()).toEqual('Hello World!');
  });
});
