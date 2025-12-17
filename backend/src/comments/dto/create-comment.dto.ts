import { IsString, IsNotEmpty, IsOptional, IsUUID, IsEmail, MaxLength } from 'class-validator';

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(5000)
    content: string;

    @IsUUID()
    @IsNotEmpty()
    postId: string;

    @IsUUID()
    @IsOptional()
    parentId?: string;

    // For logged-in users
    @IsUUID()
    @IsOptional()
    authorId?: string;

    // For guest comments
    @IsString()
    @IsOptional()
    @MaxLength(100)
    guestName?: string;

    @IsEmail()
    @IsOptional()
    guestEmail?: string;
}
