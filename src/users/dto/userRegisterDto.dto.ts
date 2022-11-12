import { MaxLength, MinLength } from "class-validator"

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
    telephone: string

    @MinLength(0)
    @MaxLength(255)
    role: string

    @MinLength(0)
    @MaxLength(255)
    permissions: string
}