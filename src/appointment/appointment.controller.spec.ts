import { Test, TestingModule } from '@nestjs/testing';
import * as mocks from 'node-mocks-http';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AppointmentGetByDoctorAndMedicalRecordDto } from './dto/appointmentGetByDoctorAndMedicalRecordDto.dto';
import { AppointmentGetByMedicalRecordDto } from './dto/appointmentGetByMedicalRecordDto.dto';
import { AppointmentRegisterDto } from './dto/appointmentRegisterDto.dto';
import { AppointmentUpdateDto } from './dto/appointmentUpdateDto.dto';
import { Appointment } from './entities/appointments.entity';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';

describe('AppointmentController', () => {
  let appointmentController: AppointmentController;
  const mockAppointmentService = {
    create: jest.fn(),
    isValid: jest.fn(),
    getByDoctorAndMedicalRecordIds: jest.fn(),
    getByMedicalRecordId: jest.fn(),
    update: jest.fn(),
  };
  const res = mocks.createResponse();
  const appointment = new Appointment();
  const appointments = [appointment];
  const appointmentRegisterDto = new AppointmentRegisterDto();
  const appointmentGetByMedicalRecordDto =
    new AppointmentGetByMedicalRecordDto();
  const appointmentRecordDto = new AppointmentGetByDoctorAndMedicalRecordDto();
  const appointmentUpdateDto = new AppointmentUpdateDto();
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentController],
      providers: [AppointmentService],
    })
      .overrideProvider(AppointmentService)
      .useValue(mockAppointmentService)
      .compile();

    appointmentController = moduleRef.get<AppointmentController>(
      AppointmentController,
    );
  });

  it('Should be defined', () => {
    expect(appointmentController).toBeDefined();
  });

  it('Should ensure the JwtAuthGuard is applied to the register method', async () => {
    const registerGuard = Reflect.getMetadata(
      '__guards__',
      AppointmentController.prototype.register,
    );
    expect(new registerGuard[0]()).toBeInstanceOf(JwtAuthGuard);
  });
  it('Should return that it registered the appointment', async () => {
    mockAppointmentService.isValid.mockReturnValue(true);
    mockAppointmentService.create.mockReturnValue('ok');
    const response = await appointmentController.register(
      res,
      appointmentRegisterDto,
    );
    expect(response.statusCode).toEqual(200);
    expect(mockAppointmentService.create).toBeCalledTimes(1);
    expect(mockAppointmentService.isValid).toBeCalledTimes(1);
  });
  it('Should return that it did not register the appointment', async () => {
    mockAppointmentService.isValid.mockReturnValue(false);
    const response = await appointmentController.register(
      res,
      appointmentRegisterDto,
    );
    expect(response.statusCode).toEqual(400);
    expect(mockAppointmentService.isValid).toBeCalledTimes(2);
  });
  it('Should return that the register method failed', async () => {
    mockAppointmentService.isValid.mockRejectedValue(new Error());
    const response = await appointmentController.register(
      res,
      appointmentRegisterDto,
    );
    expect(response.statusCode).toEqual(500);
    expect(mockAppointmentService.isValid).toBeCalledTimes(3);
  });

  it('Should ensure the JwtAuthGuard is applied to the getAppointmentByDoctorAndMedicalRecordIds method', async () => {
    const getAppointmentGuard = Reflect.getMetadata(
      '__guards__',
      AppointmentController.prototype.getAppointmentByDoctorAndMedicalRecordIds,
    );
    expect(new getAppointmentGuard[0]()).toBeInstanceOf(JwtAuthGuard);
  });
  it('Should return that it retrieved the appointment by doctor and medical record', async () => {
    mockAppointmentService.getByDoctorAndMedicalRecordIds.mockReturnValue(
      appointment,
    );
    const response =
      await appointmentController.getAppointmentByDoctorAndMedicalRecordIds(
        res,
        appointmentRecordDto,
      );
    expect(response.statusCode).toEqual(200);
    expect(
      mockAppointmentService.getByDoctorAndMedicalRecordIds,
    ).toBeCalledTimes(1);
  });
  it('Should return that it did not retrieved the appointment', async () => {
    mockAppointmentService.getByDoctorAndMedicalRecordIds.mockReturnValue(
      undefined,
    );
    const response =
      await appointmentController.getAppointmentByDoctorAndMedicalRecordIds(
        res,
        appointmentRecordDto,
      );
    expect(response.statusCode).toEqual(400);
    expect(
      mockAppointmentService.getByDoctorAndMedicalRecordIds,
    ).toBeCalledTimes(2);
  });
  it('Should return that the getAppointmentByDoctorAndMedicalRecordIds method failed', async () => {
    mockAppointmentService.getByDoctorAndMedicalRecordIds.mockRejectedValue(
      new Error(),
    );
    const response =
      await appointmentController.getAppointmentByDoctorAndMedicalRecordIds(
        res,
        appointmentRecordDto,
      );
    expect(response.statusCode).toEqual(500);
    expect(
      mockAppointmentService.getByDoctorAndMedicalRecordIds,
    ).toBeCalledTimes(3);
  });

  it('Should ensure the JwtAuthGuard is applied to the getAppointmentByMedicalRecord method', async () => {
    const getAppointmentByMedicalRecordGuard = Reflect.getMetadata(
      '__guards__',
      AppointmentController.prototype.getAppointmentByMedicalRecord,
    );
    expect(new getAppointmentByMedicalRecordGuard[0]()).toBeInstanceOf(
      JwtAuthGuard,
    );
  });
  it('Should return that it retrieved the appointment by medical record', async () => {
    mockAppointmentService.getByMedicalRecordId.mockReturnValue(appointments);
    const response = await appointmentController.getAppointmentByMedicalRecord(
      res,
      appointmentGetByMedicalRecordDto,
    );
    expect(response.statusCode).toEqual(200);
    expect(mockAppointmentService.getByMedicalRecordId).toBeCalledTimes(1);
  });
  it('Should return that it could not retrieved the appointment by medical record', async () => {
    mockAppointmentService.getByMedicalRecordId.mockReturnValue(undefined);
    const response = await appointmentController.getAppointmentByMedicalRecord(
      res,
      appointmentGetByMedicalRecordDto,
    );
    expect(response.statusCode).toEqual(400);
    expect(mockAppointmentService.getByMedicalRecordId).toBeCalledTimes(2);
  });
  it('Should return that the getAppointmentByMedicalRecord method failed', async () => {
    mockAppointmentService.getByMedicalRecordId.mockRejectedValue(new Error());
    const response = await appointmentController.getAppointmentByMedicalRecord(
      res,
      appointmentGetByMedicalRecordDto,
    );
    expect(response.statusCode).toEqual(500);
    expect(mockAppointmentService.getByMedicalRecordId).toBeCalledTimes(3);
  });

  it('Should ensure the JwtAuthGuard is applied to the update method', async () => {
    const updateGuard = Reflect.getMetadata(
      '__guards__',
      AppointmentController.prototype.update,
    );
    expect(new updateGuard[0]()).toBeInstanceOf(JwtAuthGuard);
  });
  it('Should return that it updated the appointment successfully', async () => {
    mockAppointmentService.getByDoctorAndMedicalRecordIds.mockReturnValue(
      appointment,
    );
    mockAppointmentService.update.mockReturnValue(appointment);
    const response = await appointmentController.update(
      res,
      appointmentRecordDto,
      appointmentUpdateDto,
    );
    expect(response.statusCode).toEqual(200);
    expect(
      mockAppointmentService.getByDoctorAndMedicalRecordIds,
    ).toBeCalledTimes(4);
    expect(mockAppointmentService.update).toBeCalledTimes(1);
  });
  it('Should return that it did not updated the appointment', async () => {
    mockAppointmentService.getByDoctorAndMedicalRecordIds.mockReturnValue(
      undefined,
    );
    const response = await appointmentController.update(
      res,
      appointmentRecordDto,
      appointmentUpdateDto,
    );
    expect(response.statusCode).toEqual(400);
    expect(
      mockAppointmentService.getByDoctorAndMedicalRecordIds,
    ).toBeCalledTimes(5);
  });
  it('Should return that the update method failed', async () => {
    mockAppointmentService.getByDoctorAndMedicalRecordIds.mockRejectedValue(
      new Error(),
    );
    const response = await appointmentController.update(
      res,
      appointmentRecordDto,
      appointmentUpdateDto,
    );
    expect(response.statusCode).toEqual(500);
    expect(
      mockAppointmentService.getByDoctorAndMedicalRecordIds,
    ).toBeCalledTimes(6);
  });
});
