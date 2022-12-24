import { Transform, Type } from 'class-transformer';
import { IsNumber, MaxLength, MinLength, IsInt } from 'class-validator';

export class AppointmentGetByDoctorAndMedicalRecordDto {
  @MinLength(0)
  @MaxLength(255)
  readonly doctorId: string;

  @IsInt()
  @Type(() => Number)
  readonly medicalRecordId: number;
}
