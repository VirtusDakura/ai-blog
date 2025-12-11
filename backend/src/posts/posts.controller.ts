import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { QueryPostsDto } from './dto/query-posts.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createPostDto: CreatePostDto) {
        // In production, get userId from JWT token
        const userId = createPostDto.authorId || 'temp-user-id';
        return this.postsService.create(createPostDto, userId);
    }

    @Public()
    @Get()
    findAll(@Query() query: QueryPostsDto) {
        return this.postsService.findAll({
            skip: query.skip,
            take: query.take,
            published: query.published,
            authorId: query.authorId,
        });
    }

    @Public()
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.postsService.findOne(id);
    }

    @Public()
    @Get('slug/:slug')
    findBySlug(@Param('slug') slug: string) {
        return this.postsService.findBySlug(slug);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
        // In production, get userId from JWT token
        const userId = 'temp-user-id';
        return this.postsService.update(id, updatePostDto, userId);
    }

    @Post(':id/publish')
    @HttpCode(HttpStatus.OK)
    publish(@Param('id') id: string) {
        // In production, get userId from JWT token
        const userId = 'temp-user-id';
        return this.postsService.publish(id, userId);
    }

    @Post(':id/unpublish')
    @HttpCode(HttpStatus.OK)
    unpublish(@Param('id') id: string) {
        // In production, get userId from JWT token
        const userId = 'temp-user-id';
        return this.postsService.unpublish(id, userId);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        // In production, get userId from JWT token
        const userId = 'temp-user-id';
        return this.postsService.remove(id, userId);
    }
}
