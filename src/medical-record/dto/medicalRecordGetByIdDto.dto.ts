import { Type } from "class-transformer";
import { IsInt } from "class-validator"

export class MedicalRecordGetByIdDto {
    @IsInt()
    @Type(() => Number)
    readonly medicalRecordId: number;
}