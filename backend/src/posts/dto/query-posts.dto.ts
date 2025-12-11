import { IsOptional, IsBoolean, IsString, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryPostsDto {
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

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    published?: boolean;

    @IsOptional()
    @IsString()
    authorId?: string;
}
