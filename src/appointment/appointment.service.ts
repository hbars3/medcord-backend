import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointments.entity';
import { Repository } from 'typeorm';
import { AppointmentRegisterDto } from './dto/appointmentRegisterDto.dto';
import { UsersService } from '../users/users.service';
import { MedicalRecord } from '../medical-record/entities/medicalRecord.entity';
import { User } from 'src/users/entities/users.entity';
import { MedicalRecordService } from '../medical-record/medical-record.service';

@Injectable()
export class AppointmentService {
    @Inject(UsersService)
    private usersService: UsersService;

    @Inject(MedicalRecord)
    private medicalRecordsService: MedicalRecordService;

    constructor(
        @InjectRepository(Appointment)
        private readonly appointmentsRepository: Repository<Appointment>,
    ) {}

    async create(body: AppointmentRegisterDto) {

        const doctor: User = await this.usersService.getByEmail(body.doctorEmail);
        const medicalRecord: MedicalRecord = await this.medicalRecordsService.getById(body.medicalRecordId);

        let appointment: Appointment = {
            specialty: body.specialty,
            doctor,
            medicalRecord,
            date: body.date,
            hour: body.hour
        } 

        const newAppointment = this.appointmentsRepository.create(appointment);
        await this.appointmentsRepository.save(newAppointment);
        return {
            newAppointment
        };
      }
    
}
