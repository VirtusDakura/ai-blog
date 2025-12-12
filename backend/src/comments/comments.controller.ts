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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { QueryCommentsDto } from './dto/query-comments.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createCommentDto: CreateCommentDto) {
        // In production, get userId from JWT token
        const userId = 'temp-user-id';
        return this.commentsService.create(createCommentDto, userId);
    }

    @Public()
    @Get()
    findAll(@Query() query: QueryCommentsDto) {
        return this.commentsService.findAll({
            skip: query.skip,
            take: query.take,
            postId: query.postId,
        });
    }

    @Public()
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.commentsService.findOne(id);
    }

    @Public()
    @Get('post/:postId')
    findByPost(
        @Param('postId') postId: string,
        @Query('skip') skip?: number,
        @Query('take') take?: number,
    ) {
        return this.commentsService.findByPost(postId, { skip, take });
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateCommentDto: UpdateCommentDto,
    ) {
        // In production, get userId from JWT token
        const userId = 'temp-user-id';
        return this.commentsService.update(id, updateCommentDto, userId);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    remove(@Param('id') id: string) {
        // In production, get userId and role from JWT token
        const userId = 'temp-user-id';
        const isAdmin = false;
        return this.commentsService.remove(id, userId, isAdmin);
    }
}
