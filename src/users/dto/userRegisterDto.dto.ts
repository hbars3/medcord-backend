import { IsIn, MaxLength, MinLength } from "class-validator"

export class UserRegisterDto  {
 
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
    email: string

    
    @MinLength(0)
    @MaxLength(255)
    password: string

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