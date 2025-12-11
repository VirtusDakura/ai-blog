import { IsString, IsNotEmpty, IsUUID, MaxLength } from 'class-validator';

export class GenerateEmbeddingsDto {
    @IsString()
    @IsNotEmpty({ message: 'Content is required' })
    @MaxLength(50000, { message: 'Content must not exceed 50000 characters' })
    content: string;

    @IsString()
    @IsNotEmpty({ message: 'Post ID is required' })
    @IsUUID('4', { message: 'Post ID must be a valid UUID' })
    postId: string;
}
