import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalRecordService } from './medical-record.service';
import { MedicalRecord } from './entities/medicalRecord.entity';
import { MedicalRecordRegisterDto } from './dto/medicalRecordRegisterDto.dto';

describe('MedicalRecordService', () => {
  let medicalRecordService: MedicalRecordService;
  let medicalRecordRepository: MockRepository<MedicalRecord>;

  const mockRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
  });
  type MockRepository<MedicalRecord> = Partial<
    Record<keyof Repository<MedicalRecord>, jest.Mock>
  >;

  const medicalRecord = new MedicalRecord();
  const medicalRecordRegisterDto = new MedicalRecordRegisterDto();
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        MedicalRecordService,
        {
          provide: getRepositoryToken(MedicalRecord),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    medicalRecordService = moduleRef.get<MedicalRecordService>(MedicalRecordService);
    medicalRecordRepository = moduleRef.get(getRepositoryToken(MedicalRecord));
  });

  it('Should be defined', () => {
    expect(medicalRecordService).toBeDefined();
  });
  
  it('Should return that it registered the user', async () => {
    medicalRecordRepository.create.mockReturnValue(medicalRecord);
    medicalRecordRepository.save.mockReturnThis();
    expect(await medicalRecordService.create(medicalRecordRegisterDto)).toEqual({
      medicalRecord: medicalRecord,
    });
    expect(medicalRecordRepository.create).toBeCalledTimes(1);
    expect(medicalRecordRepository.save).toBeCalledTimes(1);
  });
});
