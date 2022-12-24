import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentGetByDoctorAndMedicalRecordDto } from './dto/appointmentGetByDoctorAndMedicalRecordDto.dto';
import { AppointmentRegisterDto } from './dto/appointmentRegisterDto.dto';
import { AppointmentUpdateDto } from './dto/appointmentUpdateDto.dto';
import { Appointment } from './entities/appointments.entity';
import { AppointmentService } from './appointment.service';
import { MedicalRecordService } from '../medical-record/medical-record.service';
import { MedicalRecord } from '../medical-record/entities/medicalRecord.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/users.entity';

describe('AppointmentService', () => {
  let appointmentService: AppointmentService;
  let appointmentRepository: MockRepository<Appointment>;
  let userService: UsersService;
  let medicalRecordService: MedicalRecordService;

  const mockRepository = () => ({
    create: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  });

  type MockRepository<Appointment> = Partial<
    Record<keyof Repository<Appointment>, jest.Mock>
  >;

  const appointment = new Appointment();
  const appointmentRegisterDto = new AppointmentRegisterDto();
  const appointmentRecordDto = new AppointmentGetByDoctorAndMedicalRecordDto();
  const appointmentUpdateDtoWithoutChanges = new AppointmentUpdateDto();
  const appointmentUpdateDtoWithChanges = {
    analysis: 'analysis',
    diagnostic: 'diagnostic',
    medicines: 'medicines',
  };
  const user = new User();
  const medicalRecord = new MedicalRecord();
  const doctorEmail = 'doctor@abc.com';
  const doctorId = '1';
  const medicalRecordId = 1;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentService,
        {
          provide: getRepositoryToken(Appointment),
          useValue: mockRepository(),
        },
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
        MedicalRecordService,
        {
          provide: getRepositoryToken(MedicalRecord),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    appointmentService = moduleRef.get<AppointmentService>(AppointmentService);
    appointmentRepository = moduleRef.get(getRepositoryToken(Appointment));
    userService = moduleRef.get<UsersService>(UsersService);
    medicalRecordService =
      moduleRef.get<MedicalRecordService>(MedicalRecordService);
  });

  it('Should be defined', () => {
    expect(appointmentService).toBeDefined();
  });

  it('Should return that the appointment, doctor and medical record are valid', async () => {
    const spyIsAlreadyRegisteredUser = jest
      .spyOn(userService, 'isAlreadyRegistered')
      .mockResolvedValue(true);
    const spyisAlreadyRegisteredMedicalRecord = jest
      .spyOn(medicalRecordService, 'isAlreadyRegistered')
      .mockResolvedValue(true);
    expect(
      await appointmentService.isValid(doctorEmail, medicalRecordId),
    ).toEqual(true);
    expect(spyIsAlreadyRegisteredUser).toBeCalledTimes(1);
    expect(spyisAlreadyRegisteredMedicalRecord).toBeCalledTimes(1);
  });

  it('Should return that it created the appointment', async () => {
    const spyUser = jest
      .spyOn(userService, 'getByEmail')
      .mockResolvedValue(user);
    const spyMedicalRecord = jest
      .spyOn(medicalRecordService, 'getById')
      .mockResolvedValue(medicalRecord);
    appointmentRepository.create.mockReturnValue(appointment);
    appointmentRepository.save.mockReturnThis();
    expect(await appointmentService.create(appointmentRegisterDto)).toEqual({
      appointment,
    });
    expect(appointmentRepository.create).toBeCalledTimes(1);
    expect(appointmentRepository.save).toBeCalledTimes(1);
    expect(spyUser).toBeCalledTimes(1);
    expect(spyMedicalRecord).toBeCalledTimes(1);
  });

  it('Should return that it retrieved appointment by doctor and medical record', async () => {
    appointmentRepository.findOne.mockReturnValue(appointment);
    expect(
      await appointmentService.getByDoctorAndMedicalRecordIds(
        doctorId,
        medicalRecordId,
      ),
    ).toEqual(appointment);
    expect(appointmentRepository.findOne).toBeCalledTimes(1);
  });

  it('Should return that it updated the appointment without changes', async () => {
    appointmentRepository.update.mockReturnThis();
    const getByDoctorAndMedicalRecordIdsAppointment = jest
      .spyOn(appointmentService, 'getByDoctorAndMedicalRecordIds')
      .mockResolvedValue(appointment);
    expect(
      await appointmentService.update(
        appointment.id,
        appointmentRecordDto,
        appointmentUpdateDtoWithoutChanges,
      ),
    ).toEqual(appointment);
    expect(appointmentRepository.update).toBeCalledTimes(1);
    expect(getByDoctorAndMedicalRecordIdsAppointment).toBeCalledTimes(1);
  });
  it('Should return that it updated the appointment with all changes', async () => {
    appointmentRepository.update.mockReturnThis();
    appointment.analysis = appointmentUpdateDtoWithChanges.analysis;
    appointment.diagnostic = appointmentUpdateDtoWithChanges.diagnostic;
    appointment.medicines = appointmentUpdateDtoWithChanges.medicines;
    const getByDoctorAndMedicalRecordIdsSpy = jest
      .spyOn(appointmentService, 'getByDoctorAndMedicalRecordIds')
      .mockResolvedValue(appointment);
    expect(
      await appointmentService.update(
        appointment.id,
        appointmentRecordDto,
        appointmentUpdateDtoWithChanges,
      ),
    ).toEqual(appointment);
    expect(appointmentRepository.update).toBeCalledTimes(1);
    expect(getByDoctorAndMedicalRecordIdsSpy).toBeCalledTimes(1);
  });
});
