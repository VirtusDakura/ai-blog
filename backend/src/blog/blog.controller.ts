import { Controller, Post, Get, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogSetupDto } from './dto/blog-setup.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('blog')
export class BlogController {
    constructor(private readonly blogService: BlogService) { }

    @Public()
    @Post('setup')
    @HttpCode(HttpStatus.OK)
    async setupBlog(@Body() blogSetupDto: BlogSetupDto) {
        // userId is now a required field in the DTO
        return this.blogService.setupBlog(blogSetupDto.userId, blogSetupDto);
    }

    @Public()
    @Get('settings')
    async getBlogSettings(@Query('userId') userId: string) {
        if (!userId) {
            return {
                blogName: null,
                subdomain: null,
                hasCompletedOnboarding: false,
            };
        }
        return this.blogService.getBlogSettings(userId);
    }

    @Public()
    @Get('status')
    async getBlogStatus(@Query('userId') userId: string) {
        if (!userId) {
            return {
                hasCompletedOnboarding: false,
                subdomain: null,
                blogName: null,
            };
        }
        return this.blogService.getBlogStatus(userId);
    }

    @Public()
    @Get('check-subdomain')
    async checkSubdomain(@Query('subdomain') subdomain: string, @Query('userId') userId?: string) {
        return this.blogService.checkSubdomainAvailability(subdomain, userId);
    }

    @Public()
    @Get(':subdomain')
    async getBlogBySubdomain(@Param('subdomain') subdomain: string) {
        return this.blogService.getBlogBySubdomain(subdomain);
    }
}
