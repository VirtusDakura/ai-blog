import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchQueryDto {
    @IsString()
    @IsNotEmpty({ message: 'Query is required' })
    q: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(50)
    @Transform(({ value }) => parseInt(value, 10))
    limit?: number = 5;
}
