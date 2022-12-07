import { IsOptional, MaxLength, MinLength } from 'class-validator';

export class UserUpdateDto {

    @MinLength(0)
    @MaxLength(255)
    @IsOptional()
    email: string

    @MinLength(0)
    @MaxLength(255)
    @IsOptional()
    password: string
    
    @MinLength(0)
    @MaxLength(255)
    @IsOptional()
    telephone: string
} 