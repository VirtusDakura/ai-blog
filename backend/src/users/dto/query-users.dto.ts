import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryUsersDto {
    @IsOptional()
    @IsInt()
    @Min(0)
    @Transform(({ value }) => parseInt(value, 10))
    skip?: number = 0;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    @Transform(({ value }) => parseInt(value, 10))
    take?: number = 10;
}
