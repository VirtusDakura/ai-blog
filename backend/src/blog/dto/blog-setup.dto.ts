import { IsString, IsNotEmpty, IsOptional, IsBoolean, MinLength, MaxLength, Matches } from 'class-validator';

export class BlogSetupDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    blogName: string;

    @IsString()
    @IsOptional()
    @MaxLength(200)
    blogDescription?: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(30)
    @Matches(/^[a-z0-9-]+$/, { message: 'Subdomain can only contain lowercase letters, numbers, and hyphens' })
    subdomain: string;

    @IsString()
    @IsOptional()
    customDomain?: string;

    @IsBoolean()
    @IsOptional()
    useCustomDomain?: boolean;

    @IsString()
    @IsOptional()
    category?: string;

    @IsString()
    @IsOptional()
    theme?: string;

    @IsString()
    @IsOptional()
    colorScheme?: string;

    @IsString()
    @IsOptional()
    @MinLength(2)
    @MaxLength(50)
    displayName?: string;

    @IsString()
    @IsOptional()
    @MaxLength(160)
    bio?: string;

    @IsString()
    @IsOptional()
    profileImage?: string;

    @IsString()
    @IsOptional()
    timezone?: string;

    @IsString()
    @IsOptional()
    language?: string;

    @IsBoolean()
    @IsOptional()
    onboardingCompleted?: boolean;
}
