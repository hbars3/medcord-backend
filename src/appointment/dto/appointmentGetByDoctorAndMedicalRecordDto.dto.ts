import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class AppointmentGetByDoctorAndMedicalRecordDto {
  @IsInt()
  @Type(() => Number)
  readonly doctorId: number;

  @IsInt()
  @Type(() => Number)
  readonly medicalRecordId: number;
}
