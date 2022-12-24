import { Test, TestingModule } from '@nestjs/testing';
import * as mocks from 'node-mocks-http';
import { MedicalRecordController } from './medical-record.controller';
import { MedicalRecordService } from './medical-record.service';
import { MedicalRecordGetByIdDto } from './dto/medicalRecordGetByIdDto.dto';
import { MedicalRecordGetByPatientDto } from './dto/medicalRecordGetByPatientDto.dto';
import { MedicalRecordRegisterDto } from './dto/medicalRecordRegisterDto.dto';
import { MedicalRecord } from './entities/medicalRecord.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('MedicalRecordController', () => {
  let medicalRecordController: MedicalRecordController;
  const mockMedicalRecordService = {
    create: jest.fn(),
    getById: jest.fn(),
    getByPatientName: jest.fn(),
    getMedicalRecords: jest.fn(),
    
  };
  const res = mocks.createResponse();
  const medicalRecord = new MedicalRecord();
  const medicalRecords = [medicalRecord];
  const medicalRecordGetByIdDto = new MedicalRecordGetByIdDto();
  const medicalRecordRegisterDto = new MedicalRecordRegisterDto();
  const medicalRecordGetByPatientDto = new MedicalRecordGetByPatientDto();
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [MedicalRecordController],
      providers: [MedicalRecordService],
    })
      .overrideProvider(MedicalRecordService)
      .useValue(mockMedicalRecordService)
      .compile();

    medicalRecordController = moduleRef.get<MedicalRecordController>(
      MedicalRecordController,
    );
  });

  it('Should be defined', () => {
    expect(medicalRecordController).toBeDefined();
  });

  it('Should ensure the JwtAuthGuard is applied to the register method', async () => {
    const registerGuard = Reflect.getMetadata(
      '__guards__',
      MedicalRecordController.prototype.register,
    );
    expect(new registerGuard[0]()).toBeInstanceOf(JwtAuthGuard);
  });
  it('Should return that it registered the medical record', async () => {
    mockMedicalRecordService.create.mockReturnValue('ok');
    const response = await medicalRecordController.register(
      res,
      medicalRecordRegisterDto,
    );
    expect(response.statusCode).toEqual(200);
    expect(mockMedicalRecordService.create).toBeCalledTimes(1);
  });
  it('Should return that the register failed', async () => {
    mockMedicalRecordService.create.mockRejectedValue(new Error());
    const response = await medicalRecordController.register(
      res,
      medicalRecordRegisterDto,
    );
    expect(response.statusCode).toEqual(500);
    expect(mockMedicalRecordService.create).toBeCalledTimes(2);
  });

  it('Should ensure the JwtAuthGuard is applied to the getMedicalRecords method', async () => {
    const getMedicalRecordsGuard = Reflect.getMetadata(
      '__guards__',
      MedicalRecordController.prototype.getMedicalRecords,
    );
    expect(new getMedicalRecordsGuard[0]()).toBeInstanceOf(JwtAuthGuard);
  });
  it('Should return that it retrieved all medical records', async () => {
    mockMedicalRecordService.getMedicalRecords.mockReturnValue(medicalRecords);
    const response = await medicalRecordController.getMedicalRecords(res);
    expect(response.statusCode).toEqual(200);
    expect(mockMedicalRecordService.getMedicalRecords).toBeCalledTimes(1);
  });
  it('Should return that it did not retrieve all medical records', async () => {
    mockMedicalRecordService.getMedicalRecords.mockRejectedValue(new Error());
    const response = await medicalRecordController.getMedicalRecords(res);
    expect(response.statusCode).toEqual(500);
    expect(mockMedicalRecordService.getMedicalRecords).toBeCalledTimes(2);
  });

  it('Should ensure the JwtAuthGuard is applied to the getMedicalRecordsByPatientName method', async () => {
    const getRecordsByPatientNameGuard = Reflect.getMetadata(
      '__guards__',
      MedicalRecordController.prototype.getMedicalRecordsByPatientName,
    );
    expect(new getRecordsByPatientNameGuard[0]()).toBeInstanceOf(JwtAuthGuard);
  });
  it('Should return that it found medical record by patient name', async () => {
    mockMedicalRecordService.getByPatientName.mockReturnValue(medicalRecord);
    const response =
      await medicalRecordController.getMedicalRecordsByPatientName(
        res,
        medicalRecordGetByPatientDto,
      );
    expect(response.statusCode).toEqual(200);
    expect(mockMedicalRecordService.getByPatientName).toBeCalledTimes(1);
  });
  it('Should return that it did not find medical record by patient name', async () => {
    mockMedicalRecordService.getByPatientName.mockReturnValue(undefined);
    const response =
      await medicalRecordController.getMedicalRecordsByPatientName(
        res,
        medicalRecordGetByPatientDto,
      );
    expect(response.statusCode).toEqual(400);
    expect(mockMedicalRecordService.getByPatientName).toBeCalledTimes(2);
  });
  it('Should return that the getMedicalRecordsByPatientName method failed', async () => {
    mockMedicalRecordService.getByPatientName.mockRejectedValue(new Error());
    const response =
      await medicalRecordController.getMedicalRecordsByPatientName(
        res,
        medicalRecordGetByPatientDto,
      );
    expect(response.statusCode).toEqual(500);
    expect(mockMedicalRecordService.getByPatientName).toBeCalledTimes(3);
  });

  it('Should ensure the JwtAuthGuard is applied to the getByID method', async () => {
    const getByIDGuard = Reflect.getMetadata(
      '__guards__',
      MedicalRecordController.prototype.getByID,
    );
    expect(new getByIDGuard[0]()).toBeInstanceOf(JwtAuthGuard);
  });
  it('Should return that it found medical record by id', async () => {
    mockMedicalRecordService.getById.mockReturnValue(medicalRecord);
    const response =
      await medicalRecordController.getByID(
        res,
        medicalRecordGetByIdDto,
      );
    expect(response.statusCode).toEqual(200);
    expect(mockMedicalRecordService.getById).toBeCalledTimes(1);
  });
  it('Should return that it did not find medical record by id', async () => {
    mockMedicalRecordService.getById.mockReturnValue(undefined);
    const response =
      await medicalRecordController.getByID(
        res,
        medicalRecordGetByIdDto,
      );
    expect(response.statusCode).toEqual(400);
    expect(mockMedicalRecordService.getById).toBeCalledTimes(2);
  });
  it('Should return that the getByID method failed', async () => {
    mockMedicalRecordService.getById.mockRejectedValue(new Error());
    const response =
      await medicalRecordController.getByID(
        res,
        medicalRecordGetByIdDto,
      );
    expect(response.statusCode).toEqual(500);
    expect(mockMedicalRecordService.getById).toBeCalledTimes(3);
  });
});
