import {  MaxLength, MinLength } from 'class-validator';

export class AppointmentGetByDoctorAndMedicalRecordDto {
  @MinLength(0)
  @MaxLength(255)
  readonly doctorId: string;

  @MinLength(0)
  @MaxLength(255)
  readonly medicalRecordId: string;
}
