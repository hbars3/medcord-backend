import { Transform, Type } from 'class-transformer';
import { IsNumber, MaxLength, MinLength, IsInt } from 'class-validator';

export class AppointmentGetByMedicalRecordDto {
  @IsInt()
  @Type(() => Number)
  readonly medicalRecordId: number;
}
