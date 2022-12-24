import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class AppointmentGetByMedicalRecordDto {
  @IsInt()
  @Type(() => Number)
  readonly medicalRecordId: number;
}
