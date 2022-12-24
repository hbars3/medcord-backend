import { Transform, Type } from 'class-transformer';
import { IsDate, IsIn, IsInt, IsNumber, MaxLength, MinLength } from 'class-validator';

export class AppointmentRegisterDto {
  @MinLength(0)
  @MaxLength(255)
  @IsIn(['Medicina General', 'Oftalmologia', 'Pediatria'])
  readonly specialty: string;

  @MinLength(0)
  @MaxLength(255)
  readonly doctorEmail: string;

  @IsInt()
  @Type(() => Number)
  readonly medicalRecordId: number;

  @Type(() => Date)
  @IsDate()
  readonly date: Date;

  @Type(() => Date)
  @IsDate()
  readonly hour: Date;
}
