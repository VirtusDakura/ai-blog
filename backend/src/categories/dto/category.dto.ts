import { IsString, IsNotEmpty, IsOptional, MaxLength, Matches } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name: string;

    @IsString()
    @IsOptional()
    @MaxLength(200)
    description?: string;

    @IsString()
    @IsOptional()
    @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'Color must be a valid hex color' })
    color?: string;
}

export class UpdateCategoryDto {
    @IsString()
    @IsOptional()
    @MaxLength(50)
    name?: string;

    @IsString()
    @IsOptional()
    @MaxLength(200)
    description?: string;

    @IsString()
    @IsOptional()
    color?: string;
}

export class CreateTagDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    name: string;
}
