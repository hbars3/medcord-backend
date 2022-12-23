import { Type } from 'class-transformer';
import { IsDate, MaxLength, MinLength } from 'class-validator';

export class AppointmentRegisterDto {
  @MinLength(0)
  @MaxLength(255)
  readonly specialty: string;

  @MinLength(0)
  @MaxLength(255)
  readonly doctorEmail: string;

  @MinLength(0)
  @MaxLength(255)
  readonly medicalRecordId: string;

  @Type(() => Date)
  @IsDate()
  readonly date: Date;

  @Type(() => Date)
  @IsDate()
  readonly hour: Date;
}
