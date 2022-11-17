import { Test } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('Notes Controller', () => {
    let appController: AppController;
    let appService: AppService;
    const mockAppService = {
      getHello: jest.fn().mockReturnValue('Hello'),
    };
    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
        controllers: [AppController],
        providers: [AppService],
      })
        .overrideProvider(AppService)
        .useValue(mockAppService)
        .compile();
      appController = moduleRef.get<AppController>(AppController);
      appService = moduleRef.get<AppService>(AppService);
    });
  
    it('Should return that it said Hello', async () => {
      expect(appController.getHello()).toEqual('Hello');
      expect(mockAppService.getHello).toBeCalledTimes(1);
      expect(mockAppService.getHello).toBeCalledWith();
    });
  });
  