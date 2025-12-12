import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class GenerateIdeasDto {
    @IsString()
    @IsOptional()
    niche?: string;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(10)
    @IsOptional()
    count?: number = 5;
}
