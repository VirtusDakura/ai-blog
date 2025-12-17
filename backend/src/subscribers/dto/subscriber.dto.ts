import { IsString, IsNotEmpty, IsOptional, IsEmail, MaxLength, IsEnum, IsDateString } from 'class-validator';

export class CreateSubscriberDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    name?: string;
}

export class CreateCampaignDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    subject: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsDateString()
    @IsOptional()
    scheduledAt?: string;
}

export class UpdateNewsletterSettingsDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    enabled?: boolean;
    doubleOptIn?: boolean;
    welcomeEmail?: boolean;
    newPostNotification?: boolean;
    weeklyDigest?: boolean;
}
