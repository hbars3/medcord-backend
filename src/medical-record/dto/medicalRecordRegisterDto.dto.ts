import { IsDateString, IsIn, MaxLength, MinLength } from 'class-validator';

export class MedicalRecordRegisterDto {
  @MinLength(0)
  @MaxLength(255)
  firstName: string;

  @MinLength(0)
  @MaxLength(255)
  lastName: string;

  @MinLength(0)
  @MaxLength(12)
  dni: string;

  @MinLength(0)
  @MaxLength(255)
  birthplace: string;

  @IsDateString()
  birthdate: Date;

  @MinLength(0)
  @MaxLength(255)
  @IsIn(['Peruano', 'Venezolano', 'Otro'])
  nationality: string;

  @IsIn(['Hombre', 'Mujer', 'Otro'])
  gender: string;

  @MinLength(0)
  @MaxLength(255)
  address: string;

  @MinLength(0)
  @MaxLength(255)
  telephone: string;
}
