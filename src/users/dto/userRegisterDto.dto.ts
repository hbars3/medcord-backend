import { IsIn, MaxLength, MinLength } from "class-validator"
import { baseUserDto } from "./baseUserDto"

export class UserRegisterDto extends baseUserDto {
 
    @MinLength(0)
    @MaxLength(255)
    name: string

    @MinLength(0)
    @MaxLength(255)
    lastname: string

    @MinLength(0)
    @MaxLength(255)
    gender: string

    @MinLength(0)
    @MaxLength(255)
    dni: string

    @MinLength(0)
    @MaxLength(255)
    telephone: string

    @MinLength(0)
    @MaxLength(255)
    @IsIn(["MEDIC", "NURSE", "NONE"])
    role: string

    @MinLength(0)
    @MaxLength(255)
    @IsIn(["READER", "EDITOR", "RESTRICTED"])
    permissions: string
}