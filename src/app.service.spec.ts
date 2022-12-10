import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
describe('AppService', () => {
  let appService: AppService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
