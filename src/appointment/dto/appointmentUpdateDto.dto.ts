import { IsOptional, MaxLength, MinLength } from 'class-validator';

export class AppointmentUpdateDto {
  @MinLength(0)
  @MaxLength(255)
  @IsOptional()
  readonly analysis: string;

  @MinLength(0)
  @MaxLength(255)
  @IsOptional()
  readonly diagnostic: string;

  @MinLength(0)
  @MaxLength(255)
  @IsOptional()
  readonly medicines: string;
}
