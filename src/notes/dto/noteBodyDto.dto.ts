import { IsOptional, MaxLength, MinLength } from "class-validator"

/* This class is used to validate the body of a request for a note */
export class NoteBodyDto  {
 
    @MinLength(0)
    @MaxLength(255)
    title: string

    @MinLength(0)
    @MaxLength(255)
    @IsOptional()
    description: string
}