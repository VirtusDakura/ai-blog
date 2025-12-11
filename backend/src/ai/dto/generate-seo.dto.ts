import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class GenerateSeoDto {
    @IsString()
    @IsNotEmpty({ message: 'Content is required' })
    @MaxLength(50000, { message: 'Content must not exceed 50000 characters' })
    content: string;
}
