import { IsString, IsNotEmpty, IsOptional, MaxLength, IsEnum, IsBoolean, IsInt } from 'class-validator';

export class CreatePageDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsOptional()
    template?: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    seoTitle?: string;

    @IsString()
    @IsOptional()
    @MaxLength(200)
    seoDescription?: string;
}

export class UpdatePageDto {
    @IsString()
    @IsOptional()
    @MaxLength(100)
    title?: string;

    @IsString()
    @IsOptional()
    content?: string;

    @IsString()
    @IsOptional()
    template?: string;

    @IsString()
    @IsOptional()
    status?: 'DRAFT' | 'PUBLISHED';

    @IsInt()
    @IsOptional()
    sortOrder?: number;

    @IsString()
    @IsOptional()
    seoTitle?: string;

    @IsString()
    @IsOptional()
    seoDescription?: string;
}
