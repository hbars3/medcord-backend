import { MaxLength, MinLength } from "class-validator"

export class MedicalRecordGetByPatientDto {
    @MinLength(0)
    @MaxLength(255)
    firstName: string

    @MinLength(0)
    @MaxLength(255)
    lastName: string
}