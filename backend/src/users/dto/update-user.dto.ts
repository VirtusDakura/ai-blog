import { IsOptional, IsString, MaxLength, IsUrl } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @MaxLength(50)
    firstName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    lastName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    bio?: string;

    @IsOptional()
    @IsUrl({}, { message: 'Avatar URL must be a valid URL' })
    avatarUrl?: string;
}
