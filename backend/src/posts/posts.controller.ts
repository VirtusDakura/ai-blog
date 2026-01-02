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
  UnauthorizedException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { QueryPostsDto } from './dto/query-posts.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

interface JwtPayload {
  sub?: string;
  id?: string;
  email?: string;
}

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() user: JwtPayload,
  ) {
    console.log('Posts create - user from JWT:', user);
    const userId = user?.sub || user?.id || createPostDto.authorId;
    console.log('Posts create - extracted userId:', userId);
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
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
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const userId = user?.sub || user?.id;
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.postsService.update(id, updatePostDto, userId);
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  publish(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const userId = user?.sub || user?.id;
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.postsService.publish(id, userId);
  }

  @Post(':id/unpublish')
  @HttpCode(HttpStatus.OK)
  unpublish(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const userId = user?.sub || user?.id;
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.postsService.unpublish(id, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const userId = user?.sub || user?.id;
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.postsService.remove(id, userId);
  }
}
