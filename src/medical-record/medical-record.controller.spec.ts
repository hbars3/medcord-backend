import { Test, TestingModule } from '@nestjs/testing';
import * as mocks from 'node-mocks-http';
import { MedicalRecordController } from './medical-record.controller';
import { MedicalRecordService } from './medical-record.service';
import { MedicalRecordRegisterDto } from './dto/medicalRecordRegisterDto.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('MedicalRecordController', () => {
  let medicalRecordController: MedicalRecordController;
  const mockMedicalRecordService = {
    create: jest.fn(),
  };
  const res = mocks.createResponse();
  const medicalRecordRegisterDto = new MedicalRecordRegisterDto();
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [MedicalRecordController],
      providers: [MedicalRecordService],
    })
    .overrideProvider(MedicalRecordService)
    .useValue(mockMedicalRecordService)
    .compile();

    medicalRecordController = moduleRef.get<MedicalRecordController>(MedicalRecordController);
  });

  it('Should be defined', () => {
    expect(medicalRecordController).toBeDefined();
  });

  it('Should ensure the JwtAuthGuard is applied to the register method', async () => {
    const updateUserGuard = Reflect.getMetadata('__guards__', MedicalRecordController.prototype.register)
    expect(new (updateUserGuard[0])).toBeInstanceOf(JwtAuthGuard)
  });
  it('Should return that it registered the medical record', async () => {
    mockMedicalRecordService.create.mockReturnValue("ok");
    const response = await medicalRecordController.register(res, medicalRecordRegisterDto);
    expect(response.statusCode).toEqual(200);
    expect(mockMedicalRecordService.create).toBeCalledTimes(1);
  });
  it('Should return that the update failed', async () => {
    mockMedicalRecordService.create.mockRejectedValue(new Error());
    const response = await medicalRecordController.register( res, medicalRecordRegisterDto);
    expect(response.statusCode).toEqual(500);
    expect(mockMedicalRecordService.create).toBeCalledTimes(2);
  });
});
