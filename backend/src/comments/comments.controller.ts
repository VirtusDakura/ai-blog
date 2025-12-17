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
import { CommentStatus } from '@prisma/client';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @Public()
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createCommentDto: CreateCommentDto) {
        // Guest comments don't have userId
        const userId = createCommentDto.authorId;
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

    // Get comments for moderation (blog owner)
    @Get('moderate')
    getForModeration(
        @Query('userId') userId: string,
        @Query('status') status?: CommentStatus,
        @Query('skip') skip?: number,
        @Query('take') take?: number,
    ) {
        if (!userId) return { data: [], meta: { total: 0, pending: 0, approved: 0, spam: 0 } };
        return this.commentsService.getCommentsForModeration(userId, { skip, take, status });
    }

    // Moderate a single comment
    @Post(':id/moderate')
    moderateComment(
        @Param('id') id: string,
        @Body() body: { userId: string; action: 'approve' | 'reject' | 'spam' },
    ) {
        return this.commentsService.moderateComment(id, body.userId, body.action);
    }

    // Bulk moderate comments
    @Post('bulk-moderate')
    bulkModerate(
        @Body() body: { userId: string; ids: string[]; action: 'approve' | 'reject' | 'spam' | 'delete' },
    ) {
        return this.commentsService.bulkModerate(body.ids, body.userId, body.action);
    }

    // Reply to a comment as blog owner
    @Post(':id/reply')
    replyAsOwner(
        @Param('id') id: string,
        @Body() body: { userId: string; content: string },
    ) {
        return this.commentsService.replyAsOwner(id, body.userId, body.content);
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
        @Query('userId') userId: string,
    ) {
        return this.commentsService.update(id, updateCommentDto, userId);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    remove(@Param('id') id: string, @Query('userId') userId: string) {
        return this.commentsService.remove(id, userId, false);
    }
}
