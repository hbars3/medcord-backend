import { MaxLength, MinLength } from "class-validator"

export abstract class BaseUserDto {

    @MinLength(0)
    @MaxLength(255)
    email: string

    @MinLength(0)
    @MaxLength(255)
    password: string
}