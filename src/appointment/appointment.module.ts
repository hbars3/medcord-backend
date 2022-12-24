import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointments.entity';
import { UsersModule } from '../users/users.module';
import { MedicalRecordModule } from '../medical-record/medical-record.module';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment]), UsersModule, MedicalRecordModule],
  controllers: [AppointmentController],
  providers: [AppointmentService]
})
export class AppointmentModule {}
