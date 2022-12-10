import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('App Controller', () => {
  let appController: AppController;
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
    appController = moduleRef.get<AppController>(AppController);
  });
  it('Should be defined', () => {
    expect(appController).toBeDefined();
  });
  it('Should return that it said Hello', async () => {
    expect(appController.getHello()).toEqual('Hello World!');
  });
});
