import { IsOptional, IsInt, Min, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryCommentsDto {
    @IsUUID()
    @IsOptional()
    postId?: string;

    @Type(() => Number)
    @IsInt()
    @Min(0)
    @IsOptional()
    skip?: number = 0;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    take?: number = 20;
}
