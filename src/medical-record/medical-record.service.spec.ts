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
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  });
  type MockRepository<MedicalRecord> = Partial<
    Record<keyof Repository<MedicalRecord>, jest.Mock>
  >;

  const medicalRecord = new MedicalRecord();
  const medicalRecords = [medicalRecord];
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

    medicalRecordService =
      moduleRef.get<MedicalRecordService>(MedicalRecordService);
    medicalRecordRepository = moduleRef.get(getRepositoryToken(MedicalRecord));
  });

  it('Should be defined', () => {
    expect(medicalRecordService).toBeDefined();
  });

  it('Should return that it created the medical Record', async () => {
    medicalRecordRepository.create.mockReturnValue(medicalRecord);
    medicalRecordRepository.save.mockReturnThis();
    expect(await medicalRecordService.create(medicalRecordRegisterDto)).toEqual(
      medicalRecord,
    );
    expect(medicalRecordRepository.create).toBeCalledTimes(1);
    expect(medicalRecordRepository.save).toBeCalledTimes(1);
  });

  it('Should return that it got all medical records', async () => {
    medicalRecordRepository.find.mockReturnValue(medicalRecords);
    expect(await medicalRecordService.getMedicalRecords()).toEqual(
      medicalRecords,
    );
    expect(medicalRecordRepository.find).toBeCalledTimes(1);
  });
  it('Should return that it got medical records by patient name', async () => {
    medicalRecordRepository.findOne.mockReturnValue(medicalRecord);
    expect(await medicalRecordService.getByPatientName("Francis", "Mori")).toEqual(
      medicalRecord,
    );
    expect(medicalRecordRepository.findOne).toBeCalledTimes(1);
  });
  it('Should return that it got medical record by id', async () => {
    medicalRecordRepository.findOne.mockReturnValue(medicalRecord);
    expect(await medicalRecordService.getById(1)).toEqual(
      medicalRecord,
    );
    expect(medicalRecordRepository.findOne).toBeCalledTimes(1);
  });
  it('Should return that the medical record is already registered', async () => {
    medicalRecordRepository.findOne.mockReturnValue(medicalRecord);
    expect(await medicalRecordService.isAlreadyRegistered(1)).toBeTruthy();
    expect(medicalRecordRepository.findOne).toBeCalledTimes(1);
  });
  it('Should return that the medical record is not registered', async () => {
    medicalRecordRepository.findOne.mockReturnValue(undefined);
    expect(await medicalRecordService.isAlreadyRegistered(1)).toBeFalsy();
    expect(medicalRecordRepository.findOne).toBeCalledTimes(1);
  });
});
