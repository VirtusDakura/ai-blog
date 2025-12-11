import {
    IsString,
    IsOptional,
    IsArray,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreatePostDto {
    @IsString()
    @MinLength(1, { message: 'Title is required' })
    @MaxLength(200, { message: 'Title must not exceed 200 characters' })
    title: string;

    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500, { message: 'Excerpt must not exceed 500 characters' })
    excerpt?: string;

    @IsOptional()
    @IsString()
    coverImage?: string;

    @IsOptional()
    @IsString()
    @MaxLength(60, { message: 'SEO title must not exceed 60 characters' })
    seoTitle?: string;

    @IsOptional()
    @IsString()
    @MaxLength(160, { message: 'SEO description must not exceed 160 characters' })
    seoDescription?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    seoKeywords?: string[];

    @IsOptional()
    @IsString()
    authorId?: string;
}
