import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointments.entity';
import { Repository } from 'typeorm';
import { AppointmentRegisterDto } from './dto/appointmentRegisterDto.dto';
import { UsersService } from '../users/users.service';
import { MedicalRecord } from '../medical-record/entities/medicalRecord.entity';
import { User } from 'src/users/entities/users.entity';
import { MedicalRecordService } from '../medical-record/medical-record.service';
import { AppointmentGetByDoctorAndMedicalRecordDto } from './dto/appointmentGetByDoctorAndMedicalRecordDto.dto';
import { AppointmentUpdateDto } from './dto/appointmentUpdateDto.dto';

@Injectable()
export class AppointmentService {
  @Inject(UsersService)
  private usersService: UsersService;

  @Inject(MedicalRecordService)
  private medicalRecordsService: MedicalRecordService;

  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentsRepository: Repository<Appointment>,
  ) {}

  async isValid(doctorEmail: string, medicalRecordId: number) {
    const isValidDoctor: boolean = await this.usersService.isAlreadyRegistered(doctorEmail);
    console.log(isValidDoctor);
    const isValidMedicalRecord: boolean = await this.medicalRecordsService.isAlreadyRegistered(medicalRecordId);
    console.log(isValidMedicalRecord);

    return isValidDoctor;
  }

  async create(body: AppointmentRegisterDto) {
    const doctor: User = await this.usersService.getByEmail(body.doctorEmail);
    const medicalRecord: MedicalRecord =
      await this.medicalRecordsService.getById(body.medicalRecordId);

    let newAppointment: Appointment = {
      specialty: body.specialty,
      doctor,
      medicalRecord,
      date: body.date,
      hour: body.hour,
    };

    const appointment = this.appointmentsRepository.create(newAppointment);
    await this.appointmentsRepository.save(appointment);
    return {
      appointment,
    };
  }

  async getByDoctorAndMedicalRecordIds(
    doctorId: string,
    medicalRecordId: number,
  ): Promise<Appointment> {
    const appointment: Appointment = await this.appointmentsRepository.findOne({
      where: { doctor: doctorId, medicalRecord: medicalRecordId },
      relations: ['doctor', 'medicalRecord'],
    });

    return appointment;
  }

  async update(appointmentId: number, query: AppointmentGetByDoctorAndMedicalRecordDto, body: AppointmentUpdateDto): Promise<Appointment> {
    const updateEntity = {}

    if (body.analysis != undefined) {
      updateEntity["analysis"] = body.analysis;
    }

    if (body.diagnostic != undefined) {
      updateEntity["password"] = body.diagnostic;
    }

    if (body.medicines != undefined) {
      updateEntity["medicines"] = body.medicines;
    }

    await this.appointmentsRepository.update({
      id: appointmentId
    },
    updateEntity);

    const appointement = await this.getByDoctorAndMedicalRecordIds(query.doctorId, query.medicalRecordId);
    return appointement;
  }
}
