import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class GeneratePostDto {
    @IsString()
    @IsNotEmpty({ message: 'Topic is required' })
    @MaxLength(500, { message: 'Topic must not exceed 500 characters' })
    topic: string;

    @IsOptional()
    @IsString()
    @MaxLength(2000, { message: 'Outline must not exceed 2000 characters' })
    outline?: string;
}
